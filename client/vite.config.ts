import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default () => {
  return defineConfig({
    plugins: [react(), basicSsl()],
    server: {
      port: +(process.env.VITE_SERVER_PORT ?? 8123),
    },
  });
};
