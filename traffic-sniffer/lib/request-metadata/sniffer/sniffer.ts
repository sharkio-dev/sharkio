import bodyParser from "body-parser";
import cookieparser from "cookie-parser";
import express, { Express, NextFunction, Request, Response } from "express";
import * as http from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { RequestMetadata } from "../request-metadata";

export type SnifferConfig = {
  port: number;
  downstreamUrl: string;
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
    console.log("[" + new Date().toISOString() + "]:" + " request logged");
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
      async (req: Request, res: Response, next: NextFunction) => {
        const { url, method, invocation } = req.body;

        try {
          console.log("executing");
          console.log({
            url: url,
            method,
            invocation,
          });

          const data = await this.data.execute(url, method, invocation);

          console.log("response");
          console.log({ data });

          res.sendStatus(200);
        } catch (e) {
          console.error("failed to execute");
          res.send(JSON.stringify(e)).status(500);
        }
      }
    );

    this.app.delete(
      "/tartigraid",
      (req: Request, res: Response, next: NextFunction) => {
        res.json(this.data.clearData());
      }
    );

    this.app.use(this.snifferMiddleWare.bind(this));

    this.app.use(
      "*",
      createProxyMiddleware({ target: this.config.downstreamUrl })
    );

    console.log(
      `start sniffing requests for ${this.config.downstreamUrl} on port ${this.config.port}`
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
