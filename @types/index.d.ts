import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from '../supabase/database.types'
import supabaseClient from "../supabase/client";

declare module 'fastify' {
  interface FastifyRequest {
    supabase: SupabaseClient<Database>
    // supabase: ReturnType<typeof supabaseClient>
  }
}