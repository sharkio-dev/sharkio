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
import MockController from './mock/mock-controller';
import { MockManager } from "./mock/mock-handler";

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
  private mockController: MockController;
  private mockManager: MockManager;
  private id: string;
  private isStarted: boolean;

  constructor(_config: SnifferConfig) {
    this.data = new RequestMetadata();
    this.config = _config;
    this.app = express();
    this.id = _config.id;
    this.isStarted = false;
    this.mockManager = new MockManager();
    this.mockController = new MockController(this.mockManager);

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
    this.data.interceptRequest(req);
    next();
  }

  getApp() {
    return this.app;
  }

  getPort() {
    return this.config.port;
  }

  getData(): PathResponseData[] {
    return this.data.getData();
  }

  setup() {
    this.app.use(json());
    this.mockController.setup(this.app);
    this.app.use(this.requestInterceptor.bind(this));
    this.app.use(this.proxyMiddleware);
  }

  clearData() {
    this.data.clearData();
  }

  execute(url: string, method: string, invocation: Invocation) {
    const executionUrl = `http://localhost:${this.config.port}${url}`;
    return this.data.execute(executionUrl, method, invocation);
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
    this.server?.close();
    this.isStarted = false;
    console.log("stopping sniffer \n" + JSON.stringify(this.config, null, 2));
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
}
