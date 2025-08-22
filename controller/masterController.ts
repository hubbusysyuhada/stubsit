import { FastifyReply, FastifyRequest } from "fastify";
import slug from "../helper/slug";
import { Database } from "../supabase/database.types";

export default class MasterController {

  static async getAllGroups(request: FastifyRequest, reply: FastifyReply) {
    // @ts-ignore
    const { data } = await request.supabase
      .from('groups')
      .select('name, description, slug, endpoints(name, slug, calls(id, slug, method))')
      .order('id', { ascending: false })
      .order('id', { ascending: false, foreignTable: 'endpoints' })
    return reply.code(200).send({ data })
  }

  static async getGroupBySlug(request: FastifyRequest<{Params: { group: string }}>, reply: FastifyReply) {
    // @ts-ignore
    const { data } = await request.supabase
      .from('groups')
      .select('name, description, slug, endpoints(name, description, slug)')
      .eq('slug', request.params.group)
      .order('id', { ascending: false, foreignTable: 'endpoints' })
      .single()
    return reply.code(200).send({ data })
  }

  static async newGroup(request: FastifyRequest<{Body: { name: string; description?: string; }}>, reply: FastifyReply) {
    // @ts-ignore
    const { data: group } = await request.supabase.from('groups').select('id').eq('name', request.body.name).single()
    if (group) return reply.code(400).send(new Error('This name is taken.'))
    const generatedSlug = slug()
    // @ts-ignore
    await request.supabase
      .from('groups')
      .insert([
        {
          name: request.body.name,
          description: request.body.description,
          slug: generatedSlug
        }
      ])
    return reply.code(200).send({ data: generatedSlug })
  }

  static async editGroup(request: FastifyRequest<{Body: { name: string; description?: string }; Params: { group: string }}>, reply: FastifyReply) {
    // @ts-ignore
    const { data: group } = await request.supabase.from('groups').select('id').eq('slug', request.params.group).single()
    if (!group) return reply.code(400).send(new Error('Group not found.'))
    // @ts-ignore
    const { data: existing } = await request.supabase.from('groups').select('id').eq('name', request.body.name).neq('slug', request.params.group).single()
    if (existing) return reply.code(400).send(new Error('This name is taken.'))
    // @ts-ignore
    const { data } = await request.supabase
      .from('groups')
      .update({
        name: request.body.name,
        description: request.body.description
      })
      .eq('slug', request.params.group)
      .select('name, slug, endpoints(name, slug, calls(id, slug, method))')
      .single()
    return reply.code(200).send({ data })
  }

  static async deleteGroup(request: FastifyRequest<{Params: { group: string }}>, reply: FastifyReply) {
      // @ts-ignore
      const {  data: group } = await request.supabase.from('groups').select('id, endpoints(id)').eq('slug', request.params.group).single()
      if (group) {
        if (group.endpoints.length) return reply.code(400).send(new Error('Group still has endpoints.'))
        // @ts-ignore
        await request.supabase
          .from('groups')
          .delete()
          .eq('id', group.id)
        return reply.code(200).send({ data: 'delete success' })
      }
      return reply.code(400).send(new Error('Something went wrong.'))
  }

  static async getAllEndpoints(request: FastifyRequest, reply: FastifyReply) {
    // @ts-ignore
    const { data } = await request.supabase
      .from('endpoints')
      .select('name, slug, calls(slug, method)')
      .order('id', { ascending: false })
      .order('id', { foreignTable: 'calls' })
    return reply.code(200).send({ data })
  }

  static async newEndpoint(request: FastifyRequest<{Body: { name: string; description?: string; }; Params: { group: string }}>, reply: FastifyReply) {
    if (!request.body || !request.body.name) return reply.code(400).send(new Error('Name is required.'))
    // @ts-ignore
    const { data: group } = await request.supabase.from('groups').select('id').eq('slug', request.params.group).single()
    if (!group) return reply.code(400).send(new Error('Group not found.'))
    const generatedSlug = slug()
    // @ts-ignore
    const { data: existing } = await request.supabase.from('endpoints').select('id').eq('name', request.body.name).single()
    if (existing) return reply.code(400).send(new Error('This name is taken.'))
    // @ts-ignore
    const { error, data } = await request.supabase
      .from('endpoints')
      .insert([
        {
          name: request.body.name,
          description: request.body.description,
          slug: generatedSlug,
          group_id: group.id
        }
      ])
      .select('id')
      .single()
      if (data) {
        const methods: Database["public"]["Enums"]["http_method_type"][] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
        const endpoint_id = data.id
        for (const method of methods) {
          // @ts-ignore
          await request.supabase
          .from('calls')
          .insert([
            {
              endpoint_id,
              method,
              response_code: 200,
              is_error: false,
              slug: slug()
            }
          ])

        }
    }
    if (!error) return reply.code(201).send({ data: generatedSlug })
    return reply.code(+(error.code)).send(new Error(error.details))
  }

  static async editEndpoint(request: FastifyRequest<{Body: { name: string; description: string; group: string; }; Params: { endpoint: string; group: string }}>, reply: FastifyReply) {
    // @ts-ignore
    const { data: group } = await request.supabase.from('groups').select('id').eq('slug', request.body.group).single()
    if (!group) return reply.code(400).send(new Error('Group not found.'))
    // @ts-ignore
    const { data: existing } = await request.supabase.from('endpoints').select('id').eq('name', request.body.name).neq('slug', request.params.endpoint).single()
    if (existing) return reply.code(400).send(new Error('This name is taken.'))
    // @ts-ignore
    const { data, error } = await request.supabase
      .from('endpoints')
      .update({
        name: request.body.name,
        description: request.body.description,
        group_id: group.id
      })
      .eq('slug', request.params.endpoint)
      .select('id')
      .single()
    if (!error) return reply.code(200).send({ data })
      return reply.send(new Error(error.message))
  }

  static async deleteEndpoint(request: FastifyRequest<{Params: { endpoint: string; group: string }}>, reply: FastifyReply) {
      // @ts-ignore
      const {  data: endpoint } = await request.supabase.from('endpoints').select('id').eq('slug', request.params.endpoint).single()
      if (endpoint) {
        // @ts-ignore
        await request.supabase
          .from('calls')
          .delete()
          .eq('endpoint_id', endpoint.id)
        // @ts-ignore
        await request.supabase
          .from('endpoints')
          .delete()
          .eq('id', endpoint.id)
        return reply.code(200).send({ data: 'delete success' })
      }
      return reply.code(400).send(new Error('Something went wrong.'))
  }

  static async getEndpointBySlug(request: FastifyRequest<{Params: { endpoint: string; group: string }}>, reply: FastifyReply) {
    // @ts-ignore
    const { data } = await request.supabase
      .from('endpoints').select('*, calls(slug,method,is_error,response_code)')
      .eq('slug', request.params.endpoint)
      .order('id', { foreignTable: 'calls' })
      .single()
    if (!data) return reply.code(400).send(new Error('Incorrect slug.'))
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
    const generatedSlug = slug()
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
          slug: generatedSlug
        }
      ])
    if (!error) return reply.code(201).send({ data: generatedSlug })
    return reply.send(new Error(error.message))
  }

  static async editCall(request: FastifyRequest<{
    Params: { endpoint: string; call: string; group: string };
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

  static async getCallBySlug(request: FastifyRequest<{Params: { endpoint: string; call: string; group: string }}>, reply: FastifyReply) {
    // @ts-ignore
    const { data, error } = await request.supabase
      .from('calls')
      .select('method,slug,response_code,is_error,error_message,response,endpoint:endpoints!inner(slug)')
      .eq('slug', request.params.call)
      .eq('endpoints.slug', request.params.endpoint)
      .single()
    if (data) return reply.code(200).send({ data })
    return reply.code(400).send(new Error('Incorrect slug.'))
  }
}