import { createClient } from '@supabase/supabase-js';
import env from '../env';
import { Database } from './database.types';

export default () => createClient<Database>(env.SUPABASE_URL, env.SUPABASE_TOKEN);
