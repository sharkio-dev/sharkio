import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const variables = {
  VITE_SERVER_URL: process.env.VITE_SERVER_URL,
  VITE_SUPABASE_PROJECT_URL: process.env.VITE_SUPABASE_PROJECT_URL,
  VITE_SUPABASE_ANON: process.env.VITE_SUPABASE_ANON,
  VITE_PROXY_DOMAIN: process.env.VITE_PROXY_DOMAIN,
  VITE_NODE_ENV: process.env.NODE_ENV,
  VITE_FULLSTORY_ORG_ID: process.env.VITE_FULLSTORY_ORG_ID,
};

const content = `(function(window) {
  window._env_ = window._env_ || {};
  ${Object.keys(variables)
    .map((key) => `window._env_.${key} = "${variables[key]}";`)
    .join("\n  ")}
})(this);`;

const buildPath = process.argv[2];

fs.writeFileSync(buildPath, content);
