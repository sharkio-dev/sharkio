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
import { Invocation } from "../../types";
import { InterceptedRequests } from "../intercepted-requests/intercepted-requests";
import MockManager from "./mock/mock-manager";
import MockMiddleware from "./mock/mock-middleware";

export type SnifferConfig = {
  name: string;
  port: number;
  downstreamUrl: string;
  id: string;
};

export class Sniffer {
  private id: string;
  private app: Express;
  private interceptedRequests: InterceptedRequests;
  private config: SnifferConfig;
  private server?: http.Server;
  private proxyMiddleware: RequestHandler;
  private isStarted: boolean;
  private mockManager: MockManager;
  private mockMiddleware: MockMiddleware;

  constructor(config: SnifferConfig) {
    this.interceptedRequests = new InterceptedRequests();
    this.config = config;
    this.app = express();
    this.id = config.id;
    this.isStarted = false;
    this.mockManager = new MockManager();
    this.mockMiddleware = new MockMiddleware(this.mockManager);

    this.proxyMiddleware = createProxyMiddleware({
      target: config.downstreamUrl,
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
    this.interceptedRequests.interceptRequest(req, this.config.name);
    next();
  }

  getApp() {
    return this.app;
  }

  getPort() {
    return this.config.port;
  }

  setup() {
    this.app.use(json());
    this.app.use(this.requestInterceptor.bind(this));
    this.app.use(this.mockMiddleware.mock.bind(this));
    this.app.use(this.proxyMiddleware);
  }

  invalidateInterceptedRequests() {
    this.interceptedRequests.invalidate();
  }

  execute(url: string, method: string, invocation: Invocation) {
    const executionUrl = `http://localhost:${this.config.port}${url}`;
    return this.interceptedRequests.execute(
      executionUrl,
      method,
      invocation,
      this.config.name
    );
  }

  async changeConfig(newConfig: SnifferConfig) {
    console.log("stopping server");
    await this.stop();
    console.log("changing config");
    this.config = newConfig;
    console.log("starting server with new config");
    await this.start();
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
          return resolve(undefined);
        })
        .on("error", (error) => {
          console.error(
            "Failed to start for proxy: \n" +
              JSON.stringify(this.config, null, 2) +
              "\n with error: \n" +
              error.message
          );
          // Create custom error if needed to expose more info the the application
          return reject(error);
        })
        .on("clientError", (error) => {
          console.error("clientError has occurred", error.message);
          // Create custom error if needed to expose more info the the application
          return reject(error);
        });
    });
  }

  stop() {
    return new Promise((resolve, reject) => {
      const configString = JSON.stringify(this.config, null, 2);
      console.log("stopping sniffer", configString);
      this.server?.close((error) => {
        if (error) {
          console.error(
            "couldn't stop the sniffer",
            configString,
            error.message
          );
          return reject(error);
        }
        this.isStarted = false;
        console.log("stopped sniffer", configString);
        return resolve(undefined);
      });
    });
  }

  async editSniffer(newConfig: SnifferConfig) {
    await this.stop();
    this.config = newConfig;
    this.id = newConfig.port.toString();
    this.config.id = newConfig.port.toString();
  }

  stats() {
    const { config, isStarted, proxyMiddleware, id, interceptedRequests } =
      this;
    return {
      id,
      config,
      isStarted,
      proxyMiddleware,
      interceptedRequests: interceptedRequests.stats(),
    };
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

  getMockManager() {
    return this.mockManager;
  }
}
