import { json } from "body-parser";
import express, { Express, Request, Response } from "express";
import * as http from "http";
import { SnifferManager } from "./sniffer-manager";
import { Sniffer } from "../sniffer/sniffer";

export class SnifferManagerController {
  private server: http.Server | undefined;
  private app: Express;
  private snifferManager: SnifferManager;

  constructor() {
    this.app = express();
    this.snifferManager = new SnifferManager();
    this.setup();
  }

  setup() {
    this.app.use(json());

    this.app.get(
      "/tartigraid/sniffer/invocation",
      (req: Request, res: Response) => {
        try {
          res.send(this.snifferManager.getAllData()).status(200);
        } catch (e) {
          res.sendStatus(500);
        }
      }
    );

    this.app.get("/tartigraid/sniffer", (req: Request, res: Response) => {
      res
        .send(
          this.snifferManager.getAllSniffers().map((sniffer: Sniffer) => ({
            config: sniffer.getConfig(),
            isStarted: sniffer.getIsStarted(),
          }))
        )
        .status(200);
    });

    this.app.get("/tartigraid/sniffer/:port", (req: Request, res: Response) => {
      const { port } = req.params;
      const sniffer = this.snifferManager.getSniffer(+port);

      if (sniffer !== undefined) {
        res.send(sniffer).status(200);
      } else {
        res.sendStatus(404);
      }
    });

    this.app.post("/tartigraid/sniffer", (req: Request, res: Response) => {
      const config = req.body;

      try {
        this.snifferManager.createSniffer(config);

        res.sendStatus(200);
      } catch (e: any) {
        res.sendStatus(500);
      }
    });

    this.app.post(
      "/tartigraid/sniffer/:port/actions/stop",
      (req: Request, res: Response) => {
        try {
          const { port } = req.params;
          const config = req.body;

          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            sniffer.stop();
            res.sendStatus(200);
          } else {
            res.sendStatus(404);
          }
        } catch (e: any) {
          res.sendStatus(500);
        }
      }
    );

    this.app.post(
      "/tartigraid/sniffer/:port/actions/start",
      async (req: Request, res: Response) => {
        const { port } = req.params;
        const config = req.body;

        try {
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            await sniffer.start();
            res.sendStatus(200);
          } else {
            res.sendStatus(404);
          }
        } catch (e: any) {
          res.sendStatus(500);
        }
      }
    );
  }

  start() {
    this.server = this.app.listen(5012, () => {
      console.log("server started listening");
    });
  }

  stop() {
    this.server?.close();
  }
}
