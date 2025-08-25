CREATE TYPE public.http_method_type AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE');

CREATE TABLE groups (
  id bigint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name character varying NOT NULL,
  slug character varying NOT NULL,
  description text,
  CONSTRAINT groups_name_key UNIQUE (name),
  CONSTRAINT groups_pkey PRIMARY KEY (id)
);

CREATE TABLE endpoints (
  id bigint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name character varying NOT NULL,
  description text,
  slug character varying NOT NULL,
  group_id bigint,
  CONSTRAINT endpoints_group_id_fkey FOREIGN KEY (group_id) REFERENCES groups(id),
  CONSTRAINT endpoints_pkey PRIMARY KEY (id),
  CONSTRAINT endpoints_slug_key UNIQUE (slug)
);

CREATE TABLE calls (
  id bigint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  method http_method_type NOT NULL,
  slug character varying NOT NULL,
  response_code bigint NOT NULL DEFAULT '200'::bigint,
  is_error boolean NOT NULL DEFAULT false,
  error_message text,
  endpoint_id bigint NOT NULL,
  response jsonb,
  CONSTRAINT calls_endpoint_id_fkey FOREIGN KEY (endpoint_id) REFERENCES endpoints(id),
  CONSTRAINT calls_pkey PRIMARY KEY (id),
  CONSTRAINT calls_slug_key UNIQUE (slug)
);

CREATE UNIQUE INDEX calls_method_endpoint_id_idx ON public.calls USING btree (method, endpoint_id);

CREATE UNIQUE INDEX endpoints_name_group_id_idx ON public.endpoints USING btree (name, group_id);

ALTER TABLE calls ENABLE ROW LEVEL SECURITY;

ALTER TABLE endpoints ENABLE ROW LEVEL SECURITY;

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all select" ON calls FOR SELECT USING (true);

CREATE POLICY "Allow all select" ON endpoints FOR SELECT USING (true);

CREATE POLICY "Allow all select" ON groups FOR SELECT USING (true);
