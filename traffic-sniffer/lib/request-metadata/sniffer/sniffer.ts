import { json } from "body-parser";
import express, {
  Express,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import * as http from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { Invocation, PathResponseData } from "../../../types/types";
import { RequestMetadata } from "../request-metadata";

export type SnifferConfig = {
  name: string;
  port: number;
  downstreamUrl: string;
  id: string;
};

export class Sniffer {
  private app: Express;
  private data: RequestMetadata;
  private config: SnifferConfig;
  private server: http.Server | undefined;
  private proxyMiddleware: RequestHandler;
  private id: string;
  private isStarted: boolean;

  constructor(_config: SnifferConfig) {
    this.data = new RequestMetadata();
    this.config = _config;
    this.app = express();
    this.id = _config.id;
    this.isStarted = false;

    this.proxyMiddleware = createProxyMiddleware({
      target: _config.downstreamUrl,
      secure: false,
      logLevel: "debug",
    });

    this.setup();
  }

  requestInterceptor(req: Request, res: Response, next: NextFunction) {
    console.log(
      "[" +
        new Date().toISOString() +
        "]:" +
        `${req.method} ${req.url} request logged`
    );
    this.data.interceptRequest(req, this.config.name);
    next();
  }

  getApp() {
    return this.app;
  }

  getPort() {
    return this.config.port;
  }

  getData(): PathResponseData[] {
    return this.data.stats();
  }

  setup() {
    this.app.use(json());
    this.app.use(this.requestInterceptor.bind(this));
    this.app.use(this.proxyMiddleware);
  }

  clearData() {
    this.data.invalidate();
  }

  execute(url: string, method: string, invocation: Invocation) {
    const executionUrl = `http://localhost:${this.config.port}${url}`;
    return this.data.execute(executionUrl, method, invocation, this.config.name);
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
          this.isStarted = true;
          resolve(undefined);
        })
        .on("error", (e) => {
          console.error(
            "Failed to start for proxy: \n" +
              JSON.stringify(this.config, null, 2) +
              "\n with error: \n" +
              e.message
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
    return new Promise((resolve, reject) => {
      this.server?.close((err) => {
        if (err) {
          reject(err);
        }
        this.isStarted = false;
        console.log("stopping sniffer \n" + JSON.stringify(this.config, null, 2));
        resolve(undefined);
      });
    });
  }

  getConfig() {
    return this.config;
  }

  getIsStarted() {
    return this.isStarted;
  }

  getMiddleware() {
    return this.proxyMiddleware;
  }

  getId() {
    return this.id;
  }

  async editSniffer(newConfig: SnifferConfig) {
    await this.stop();
    this.config = newConfig;
    this.id = newConfig.port.toString();
    this.config.id = newConfig.port.toString();
  }
}
