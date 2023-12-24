import z from "zod";
import "dotenv/config";

const serverVarsValidator = z.object({
  NODE_ENV: z.string().optional().default("development"),
  DATABASE_URL: z.string(),
  VITE_SUPABASE_PROJECT_URL: z.string(),
  VITE_SUPABASE_ANON: z.string(),
  LOG_LEVEL: z.string(),
  LOG_SQL: z
    .string()
    .transform((str) => {
      return str.toLowerCase() === "true";
    })
    .optional(),
  PROXY_SERVER_DOMAIN: z.string(),
  OPEN_AI_KEY: z.string().optional(),
});

const proxyVarsValidator = z.object({
  NODE_ENV: z.string().optional().default("development"),
  DATABASE_URL: z.string(),
  VITE_SUPABASE_PROJECT_URL: z.string(),
  VITE_SUPABASE_ANON: z.string(),
  LOG_LEVEL: z.string(),
  LOG_SQL: z
    .string()
    .transform((str) => {
      return str.toLowerCase() === "true";
    })
    .optional(),
  PROXY_PRIVATE_KEY_FILE: z.string().optional(),
  PROXY_CERT_FILE: z.string().optional(),
});

export class ServerEnvValidator {
  constructor() {}

  validate() {
    const envs = process.env;
    serverVarsValidator.parse(envs);
  }
}

export class ProxyEnvValidator {
  constructor() {}

  validate() {
    const envs = process.env;
    proxyVarsValidator.parse(envs);
  }
}
