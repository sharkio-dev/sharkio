import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import circleDependency from "vite-plugin-circular-dependency";

export default () => {
  return defineConfig({
    plugins: [
      circleDependency({
        circleImportThrowErr: false,
      }),
      react(),
      basicSsl(),
    ],
    server: {
      port: +(process.env.VITE_SERVER_PORT ?? 8123),
    },
  });
};
