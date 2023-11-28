import pkg from 'body-parser';
const { json } = pkg;
import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { urlencoded } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

// TODO fix domain
const getLocalUrl = (port) => `http://localhost:${port}`;

export class ProxyServer {
  app;
  proxyMiddleware;
  constructor() {
    this.app = express();
    this.app.use(cors({ origin: "*" }));
    this.app.use(json());
    this.app.use(cookieParser());
    this.app.use(urlencoded({ extended: true }));
    this.app.use((err, req, res, next) => {
      console.log(req.headers, req.url);
      console.log(err);
    });
    this.proxyMiddleware = createProxyMiddleware({
      router: this.chooseRoute.bind(this),
      secure: false,
      autoRewrite: true,
      changeOrigin: true,
      followRedirects: true,
    });
    this.app.use(this.proxyMiddleware);
  }

  chooseRoute(req) {
    const port = req.headers["x-sharkio-port"];
    if (!port) {
      console.log(
        chalk.red.white.bold("\n🌊 Ocean Warning! \n") +
        chalk.red(
          "You didn't set the port on the sniffer. Please try again.\n"
        )
      );
    }
    return getLocalUrl(port);
  }

  async start(port) {
    return this.app.listen(port);
  }
}
