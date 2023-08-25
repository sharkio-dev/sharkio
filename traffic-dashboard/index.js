import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import { fileURLToPath } from "url";

export async function startDashboard() {
  return new Promise((resolve, reject) => {
    try {
      const app = express();
      const port = 3000;

      // Proxy middleware configuration
      const proxyOptions = {
        target: "http://localhost:5012", // Replace with the target server URL
        changeOrigin: true,
      };

      // Proxy middleware
      const proxy = createProxyMiddleware("/sharkio", proxyOptions);

      // Apply the proxy middleware to all requests starting with /sharkio
      app.use(proxy);

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      app.use(cors());
      app.use(express.static(path.join(__dirname, "/dist")));

      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "dist/index.html"));
      });

      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
}
