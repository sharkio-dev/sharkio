import express, {
  Express,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import * as http from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { Invocation } from "../path-metadata";
import { RequestMetadata } from "../request-metadata";
import { json } from "body-parser";

export type SnifferConfig = {
  port: number;
  downstreamUrl: string;
};

export class Sniffer {
  private app: Express;
  private data: RequestMetadata;
  private config: SnifferConfig;
  private server: http.Server | undefined;
  private proxyMiddleware: RequestHandler;

  constructor(_config: SnifferConfig) {
    this.data = new RequestMetadata();
    this.config = _config;
    this.app = express();

    this.proxyMiddleware = createProxyMiddleware({
      target: _config.downstreamUrl,
      secure: false,
      logLevel: "debug",
    });

    this.setup();
  }

  requestInterceptor(req: Request, res: Response, next: NextFunction) {
    console.log("[" + new Date().toISOString() + "]:" + " request logged");
    this.data.interceptRequest(req);
    next();
  }

  getApp() {
    return this.app;
  }

  getPort() {
    return this.config.port;
  }

  getData() {
    return this.data.getData();
  }

  setup() {
    this.app.use(json());
    this.app.use(this.proxyMiddleware);
  }

  clearData() {
    this.data.clearData();
  }

  execute(url: string, method: string, invocation: Invocation) {
    return this.data.execute(url, method, invocation);
  }

  changeConfig(newConfig: SnifferConfig) {
    console.log("stopping server");
    this.stop();
    console.log("changing config");
    this.config = newConfig;
    console.log("starting server with new config");
    this.start();
  }

  start() {
    console.log("starting sniffer \n" + JSON.stringify(this.config, null, 2));
    return new Promise((resolve, reject) => {
      this.server = this.app
        .listen(this.config.port, () => {
          console.log(
            "started sniffing" + JSON.stringify(this.config, null, 2)
          );
          resolve(undefined);
        })
        .on("error", () => {
          console.error(
            "Failed to start for proxy: \n" +
              JSON.stringify(this.config, null, 2)
          );
          reject();
        })
        .on("clientError", () => {
          console.error("clientError has occurred");
          reject();
        });
    });
  }

  stop() {
    this.server?.close();
    console.log("stopping sniffer \n" + JSON.stringify(this.config, null, 2));
  }

  getConfig() {
    return this.config;
  }

  getMiddleware() {
    return this.proxyMiddleware;
  }
}
