import { json } from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import * as http from "http";
import "reflect-metadata";
import { useLog } from "../lib/log";
import { logMiddleware } from "./middlewares/log.middleware";
import { ProxyMiddleware } from "./middlewares/proxy.middleware";
import { requestValidator } from "../lib/request-validator/request-validator";
import { RequestInterceptor } from "./middlewares/request-interceptor";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class ProxyServer {
  private readonly port: number = 80;
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
    this.server = this.app.listen(this.port, () => {
      log.info("proxy server started listening on port" + this.port);
    });
  }

  stop() {
    this.server?.close();
  }
}
