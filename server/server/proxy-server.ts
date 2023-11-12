import { json } from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import * as http from "http";
import "reflect-metadata";
import { useLog } from "../lib/log";
import { logMiddleware } from "./middlewares/log.middleware";
import { ProxyMiddleware } from "./middlewares/proxy.middleware";
import { RequestInterceptor } from "./middlewares/request-interceptor";
import https from "https";
import fs from "fs";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class ProxyServer {
  private readonly port: number = 443;
  private app: Express;
  private server?: http.Server;

  constructor(
    private readonly proxyMiddleware: ProxyMiddleware,
    private readonly requestInterceptor: RequestInterceptor,
  ) {
    this.app = express();

    this.app.use(logMiddleware);
    this.app.use(cors({ origin: "*" }));
    this.app.use(json());
    this.app.use(cookieParser());
    this.app.use(
      this.requestInterceptor.validateBeforeProxy.bind(this.requestInterceptor),
    );
    this.app.use(this.proxyMiddleware.getMiddleware());
  }

  start() {
    var options = {
      key: fs.readFileSync(process.env.PROXY_PRIVATE_KEY_FILE ?? ""),
      cert: fs.readFileSync(process.env.PROXY_CERT_FILE ?? ""),
    };
    this.app.listen(80, () => {
      log.info("proxy server started listening on port " + 80);
    });

    const server1 = https.createServer(options, this.app);
    this.server = server1.listen(443, () => {
      log.info("proxy server started listening on port " + this.port);
    });
  }

  stop() {
    this.server?.close();
  }
}
