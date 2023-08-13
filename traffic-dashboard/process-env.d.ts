declare namespace NodeJS {
  export interface ProcessEnv {
    VITE_SUPABASE_PROJECT_URL: string;
    VITE_SUPABASE_ANON: string;
    [key: string]: string | undefined;
  }
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_PROJECT_URL: string;
  readonly VITE_SUPABASE_ANON: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
