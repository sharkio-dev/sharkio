import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
export default () => {
  return defineConfig({
    plugins: [react(), basicSsl()],
    server: {
      port: 443,
      proxy: {
        "/sharkio": "http://localhost:5012",
      },
    },
  });
};
