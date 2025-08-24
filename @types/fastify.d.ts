import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from '../supabase/database.types'

declare module 'fastify' {
  interface FastifyRequest {
    supabase: SupabaseClient<Database>
  }
}