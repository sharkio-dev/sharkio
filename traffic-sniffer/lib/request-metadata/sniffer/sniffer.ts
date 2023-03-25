import { RequestMetadata } from "../request-metadata";
import express, { Express, NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cookieparser from "cookie-parser";
import proxy from "express-http-proxy";
import * as http from "http";

export type SnifferConfig = {
  port: number;
  proxyUrl: string;
};

export class Sniffer {
  private app: Express;
  private data: RequestMetadata;
  private config: SnifferConfig;
  private server: http.Server | undefined;

  constructor(_config: SnifferConfig) {
    this.data = new RequestMetadata();
    this.config = _config;
    this.app = express();
    this.setup();
  }

  snifferMiddleWare(req: Request, res: Response, next: NextFunction) {
    this.data.extractMetadata(req);
    next();
  }

  setup() {
    this.app.use(bodyParser.json());
    this.app.use(cookieparser());

    this.app.get(
      "/tartigraid",
      (req: Request, res: Response, next: NextFunction) => {
        const data = this.data.getData();
        res.json(data);
      }
    );
    this.app.post(
      "/tartigraid/execute",
      (req: Request, res: Response, next: NextFunction) => {
        const { url, method, invocation } = req.body;
        const data = this.data.execute(url, method, invocation);
        res.json(data);
      }
    );
    this.app.delete(
      "/tartigraid",
      (req: Request, res: Response, next: NextFunction) => {
        res.json(this.data.clearData());
      }
    );

    this.app.use(this.snifferMiddleWare.bind(this));

    this.app.use("*", proxy(this.config.proxyUrl));

    console.log(
      `start sniffing requests for ${this.config.proxyUrl} on port ${this.config.port}`
    );
  }

  start() {
    this.server = this.app.listen(this.config.port, () => {
      console.log("server started listening");
    });
  }

  stop() {
    this.server?.close();
  }
}
