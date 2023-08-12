import { createClient } from '@supabase/supabase-js';

export const supabaseClient = createClient(
  process.env.SUPABASE_PROJECT_URL ?? '',
  process.env.SUPABASE_ANON ?? '',
);
