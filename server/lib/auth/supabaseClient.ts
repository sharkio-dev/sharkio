import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  process.env.VITE_SUPABASE_PROJECT_URL ?? "",
  process.env.VITE_SUPABASE_ANON ?? "",
  {
    auth: {
      persistSession: false,
    },
  },
);
