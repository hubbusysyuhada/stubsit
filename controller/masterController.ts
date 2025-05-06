import { FastifyReply, FastifyRequest } from "fastify";
import slug from "../helper/slug";
import { Database } from "../supabase/database.types";

export default class MasterController {

  static async getAllEndpoints(request: FastifyRequest, reply: FastifyReply) {
    // @ts-ignore
    const { data } = await request.supabase
      .from('endpoints')
      .select('name, slug')
    return reply.code(200).send({ data })
  }

  static async newEndpoint(request: FastifyRequest<{Body: { name: string; description?: string }}>, reply: FastifyReply) {
    if (!request.body || !request.body.name) return reply.code(400).send(new Error('Name is required.'))
    // @ts-ignore
    const { data, error } = await request.supabase
      .from('endpoints')
      .insert([
        {
          name: request.body.name,
          description: request.body.description,
          slug: slug()
        }
      ])
    if (!error) return reply.code(201).send({ data })
    return reply.code(+(error.code)).send(new Error(error.details))
  }

  static async editEndpoint(request: FastifyRequest<{Body: { name?: string; description?: string }; Params: { endpoint: string }}>, reply: FastifyReply) {
    // @ts-ignore
    const { data, error } = await request.supabase
      .from('endpoints')
      .update({
        name: request.body.name,
        description: request.body.description
      })
      .eq('slug', request.params.endpoint)
      .select('*, calls(*, query_strings(*))')
      .single()
    if (!error) return reply.code(200).send({ data })
      return reply.send(new Error(error.message))
  }

  static async deleteEndpoint(request: FastifyRequest<{Params: { endpoint: string }}>, reply: FastifyReply) {
      // @ts-ignore
      const { error } = await request.supabase
        .from('endpoints')
        .delete()
        .eq('slug', request.params.endpoint)
      if (!error) return reply.code(200).send({ data: 'delete success' })
        return reply.send(new Error(error.message))
  }

  static async getEndpointBySlug(request: FastifyRequest<{Params: { endpoint: string }}>, reply: FastifyReply) {
    // @ts-ignore
    const { data } = await request.supabase
      .from('endpoints').select('*, calls(*, query_strings(*))')
      .eq('slug', request.params.endpoint)
      .single()
    return reply.code(200).send({ data })
  }

  static async newCall(request: FastifyRequest<{
    Params: { endpoint: string };
    Body: {
      method: Database["public"]["Enums"]["http_method_type"];
      response_code: number;
      is_error?: boolean;
      error_message?: string;
      response?: Record<string, any> | any[];
    }
  }>, reply: FastifyReply) {
    // @ts-ignore
    const supabase = request.supabase
    const { method, response_code, is_error, error_message, response } = request.body
    const { data: endpoint } = await supabase.from('endpoints').select('id').eq('slug', request.params.endpoint).single()
    if (!endpoint) return reply.code(400).send(new Error('Incorrect slug.'))
    const { data, error } = await supabase
      .from('calls')
      .insert([
        {
          endpoint_id: endpoint.id,
          method,
          error_message,
          response_code,
          response,
          is_error,
          slug: slug()
        }
      ])
    if (!error) return reply.code(201).send({ data })
    return reply.send(new Error(error.message))
  }

  static async editCall(request: FastifyRequest<{
    Params: { endpoint: string; call: string };
    Body: {
      method: Database["public"]["Enums"]["http_method_type"];
      response_code: number;
      is_error?: boolean;
      error_message?: string;
      response?: Record<string, any> | any[];
    }
  }>, reply: FastifyReply) {
    // @ts-ignore
    const supabase = request.supabase
    const { method, response_code, is_error, error_message, response } = request.body
    const { data, error } = await supabase
      .from('calls')
      .update({
            error_message,
            response_code,
            response,
            is_error,
      })
      .eq('slug', request.params.call)
      .eq('endpoints.slug', request.params.endpoint)
      .select('*, endpoints!inner(*)')
      .single()
    if (!error) return reply.code(201).send({ data })
    return reply.send(new Error(error.message))
  }

  static async deleteCall(request: FastifyRequest<{Params: { endpoint: string; call: string };}>, reply: FastifyReply) {
    // @ts-ignore
    const supabase = request.supabase
    const { data: endpoint } = await supabase.from('endpoints').select('id').eq('slug', request.params.endpoint).single()
    if (!endpoint) return reply.code(400).send(new Error('Incorrect slug.'))
      const { error } = await supabase
        .from('calls')
        .delete()
        .eq('slug', request.params.call)
        .eq('endpoint_id', endpoint.id)
      if (!error) return reply.code(200).send({ data: 'delete success' })
      return reply.send(new Error(error.message))
  }
}