import express, { Express, NextFunction, Request, Response } from "express";
import * as http from "http";
import { SnifferManager } from "./sniffer-manager";
import { json } from "body-parser";

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

    this.app.get("/sniffer", (req: Request, res: Response) => {
      res.send(this.snifferManager.getAllSniffers()).status(200);
    });

    this.app.get("/sniffer/:port", (req: Request, res: Response) => {
      const { port } = req.params;
      const sniffer = this.snifferManager.getSniffer(+port);

      if (sniffer !== undefined) {
        res.send(sniffer).status(200);
      } else {
        res.sendStatus(404);
      }
    });

    this.app.post("/sniffer", async (req: Request, res: Response) => {
      const config = req.body;

      try {
        const newSniffer = this.snifferManager.createSniffer(config);
        await newSniffer.start();

        res.sendStatus(200);
      } catch (e: any) {
        res.sendStatus(500);
      }
    });

    this.app.post(
      "/sniffer/:port/actions/stop",
      async (req: Request, res: Response) => {
        const { port } = req.params;
        const config = req.body;

        try {
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
      "/sniffer/:port/actions/start",
      async (req: Request, res: Response) => {
        const { port } = req.params;
        const config = req.body;

        try {
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            sniffer.start();
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
