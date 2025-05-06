import { FastifyReply, FastifyRequest } from "fastify";
import { Database } from "../supabase/database.types";

export default class ProxyController {

  static async run(request: FastifyRequest<{Params: { endpoint: string; call: string }}>, response: FastifyReply) {
    const {method, params} = request
    if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return null
    // @ts-ignore
    const { data } = await request.supabase.from('calls')
    .select('response, is_error, response_code, error_message,endpoints!inner(slug)')
    .eq('method', method as Database["public"]["Enums"]["http_method_type"])
    .eq('slug', params.call)
    .eq('endpoints.slug', params.endpoint)
    .single()
    if (!data) return response.code(404).send(new Error(`Route ${method}:/api/${params.endpoint}/${params.call} not found`))
    else if (data.is_error) return response.code(data.response_code).send(new Error(data.error_message || ""))
    return response.code(data.response_code).send(data.response)
  }
}