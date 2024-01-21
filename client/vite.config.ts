import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import circleDependency from "vite-plugin-circular-dependency";
import { VitePWA } from "vite-plugin-pwa";

export default () => {
  return defineConfig({
    plugins: [
      circleDependency({
        circleImportThrowErr: false,
      }),
      react(),
      basicSsl(),
      VitePWA({
        registerType: "autoUpdate",
        devOptions: {
          enabled: true,
        },
      }),
    ],
    server: {
      host: "localhost.sharkio.dev",
      port: +(process.env.VITE_SERVER_PORT ?? 8123),
    },
    define: {
      VITE_SUPABASE_PROJECT_URL: process.env.VITE_SUPABASE_PROJECT_URL,
      VITE_SUPABASE_ANON: process.env.VITE_SUPABASE_ANON,
      VITE_DISABLE_SUPABASE: process.env.VITE_DISABLE_SUPABASE,
      VITE_SERVER_URL: process.env.VITE_SERVER_URL,
      VITE_PROXY_DOMAIN: process.env.VITE_PROXY_DOMAIN,
      VITE_PROXY_DOMAIN_PROTOCOL: process.env.VITE_PROXY_DOMAIN_PROTOCOL,
    },
  });
};
