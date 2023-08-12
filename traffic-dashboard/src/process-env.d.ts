declare namespace NodeJS {
  export interface ProcessEnv {
    SUPABASE_PROJECT_URL: string;
    SUPABASE_ANON: string;
    [key: string]: string | undefined;
  }
}
