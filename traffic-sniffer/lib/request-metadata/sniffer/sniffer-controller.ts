import bodyParser from "body-parser";
import cookieparser from "cookie-parser";
import { Express, NextFunction, Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { Sniffer, SnifferConfig } from "./sniffer";

export class SnifferController {
  private sniffer: Sniffer;
  private app: Express;

  constructor(_config: SnifferConfig) {
    this.sniffer = new Sniffer(_config);
    this.app = this.sniffer.getApp();
    this.setup();
  }

  start() {
    this.sniffer.start();
  }

  stop() {
    this.sniffer.stop();
  }
  setup() {
    this.app.use(bodyParser.json());
    this.app.use(cookieparser());

    this.app.get(
      "/tartigraid/config",
      (req: Request, res: Response, next: NextFunction) => {
        const config = this.sniffer.getConfig();
        res.json(config);
      }
    );

    this.app.get(
      "/tartigraid",
      (req: Request, res: Response, next: NextFunction) => {
        const data = this.sniffer.getData();
        res.json(data);
      }
    );

    this.app.post(
      "/tartigraid/config",
      async (req: Request, res: Response, next: NextFunction) => {
        console.log("changing config");
        console.log({ body: req.body });
        this.sniffer.changeConfig(req.body);
      }
    );

    this.app.post(
      "/tartigraid/stop",
      async (req: Request, res: Response, next: NextFunction) => {
        this.sniffer.stop();
      }
    );

    this.app.post(
      "/tartigraid/start",
      async (req: Request, res: Response, next: NextFunction) => {
        this.sniffer.start();
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

          const data = await this.sniffer.execute(url, method, invocation);

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
        res.json(this.sniffer.clearData());
      }
    );

    this.app.use(this.sniffer.getMiddleware.bind(this.sniffer));

    this.app.use(
      "*",
      createProxyMiddleware({
        target: this.sniffer.getConfig().downstreamUrl,
        secure: false,
        logLevel: "debug",
      })
    );
  }
}
