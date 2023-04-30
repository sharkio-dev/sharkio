import bodyParser from "body-parser";
import cookieparser from "cookie-parser";
import express, { Express, NextFunction, Request, Response } from "express";
import * as http from "http";
import httpProxy from "http-proxy";
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
  private proxy: httpProxy<
    http.IncomingMessage,
    http.ServerResponse<http.IncomingMessage>
  >;

  constructor(_config: SnifferConfig) {
    this.data = new RequestMetadata();
    this.config = _config;
    this.proxy = httpProxy.createProxyServer({});
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
      "/tartigraid/config",
      (req: Request, res: Response, next: NextFunction) => {
        const data = this.config;
        res.json(data);
      }
    );

    this.app.get(
      "/tartigraid",
      (req: Request, res: Response, next: NextFunction) => {
        const data = this.data.getData();
        res.json(data);
      }
    );

    this.app.post(
      "/tartigraid/config",
      async (req: Request, res: Response, next: NextFunction) => {
        console.log("changing config");
        console.log({ body: req.body });
        this.changeConfig(req.body);
      }
    );

    this.app.post(
      "/tartigraid/stop",
      async (req: Request, res: Response, next: NextFunction) => {
        this.stop();
      }
    );

    this.app.post(
      "/tartigraid/start",
      async (req: Request, res: Response, next: NextFunction) => {
        this.start();
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

    this.app.use("*", (req: Request, res: Response, next: NextFunction) => {
      this.proxy.web(
        req,
        res,
        {
          target: this.config.downstreamUrl,
        },
        (err) => {
          console.log("error occured on: " + this.config.downstreamUrl);
          res.sendStatus(500);
        }
      );
    });

    console.log(
      `Started sniffing requests for ${this.config.downstreamUrl} on port ${this.config.port}`
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

  changeConfig(newConfig: SnifferConfig) {
    console.log("stopping server");
    this.stop();
    console.log("changing config");
    this.config = newConfig;
    console.log("starting server with new config");
    this.start();
  }
}
