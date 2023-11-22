import z from "zod";
import "dotenv/config";

const serverVarsValidator = z.object({
  DEMO: z
    .string()
    .transform((str) => {
      return str.toLowerCase() === "true";
    })
    .optional(),
  DATABASE_URL: z.string(),
  SUPABASE_COOKIE_KEY: z.string(),
  VITE_SUPABASE_PROJECT_URL: z.string(),
  VITE_SUPABASE_ANON: z.string(),
  SUPABASE_TOKEN: z.string(),
  LOG_LEVEL: z.string(),
  LOG_SQL: z.string().transform((str) => {
    return str.toLowerCase() === "true";
  }),
  PROXY_PRIVATE_KEY_FILE: z.string(),
  PROXY_CERT_FILE: z.string(),
  OPEN_AI_KEY: z.string(),
});

export class EnvValidator {
  constructor() {}

  validate() {
    const envs = process.env;
    serverVarsValidator.parse(envs);
  }
}
