import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 443,
    proxy: {
      "/sharkio": "http://localhost:5012",
    },
    https: {
      key: fs.readFileSync("/home/ido/certs/private.key"),
      cert: fs.readFileSync("/home/ido/certs/certificate.crt"),
    },
  },
});
