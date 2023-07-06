import { Express, Request, Response } from "express";
import { Sniffer } from "../sniffer/sniffer";
import { SnifferManager } from "./sniffer-manager";

export class SnifferManagerController {
  constructor(private readonly snifferManager: SnifferManager) {}

  setup(app: Express) {
    app.get("/sharkio/sniffer/invocation", (req: Request, res: Response) => {
      try {
        res.send(this.snifferManager.getAllData()).status(200);
      } catch (e) {
        res.sendStatus(500);
      }
    });

    app.get("/sharkio/sniffer", (req: Request, res: Response) => {
      res
        .send(
          this.snifferManager.getAllSniffers().map((sniffer: Sniffer) => ({
            config: sniffer.getConfig(),
            isStarted: sniffer.getIsStarted(),
          }))
        )
        .status(200);
    });

    app.get("/sharkio/sniffer/:port", (req: Request, res: Response) => {
      const { port } = req.params;
      const sniffer = this.snifferManager.getSniffer(+port);

      if (sniffer !== undefined) {
        res.send(sniffer).status(200);
      } else {
        res.sendStatus(404);
      }
    });

    app.post("/sharkio/sniffer", (req: Request, res: Response) => {
      const config = req.body;

      try {
        this.snifferManager.createSniffer(config);

        res.sendStatus(200);
      } catch (e: any) {
        res.sendStatus(500);
      }
    });

    app.post(
      "/sharkio/sniffer/:port/actions/stop",
      (req: Request, res: Response) => {
        try {
          const { port } = req.params;

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

    app.post(
      "/sharkio/sniffer/:port/actions/start",
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

    app.post(
      "/sharkio/sniffer/:port/actions/execute",
      async (req: Request, res: Response) => {
        const { port } = req.params;
        const { url, method, invocation } = req.body;
        try {
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            await sniffer
              .execute(url, method, invocation)
              .catch((e) => console.error("erro while executing"));
            res.sendStatus(200);
          } else {
            res.sendStatus(404);
          }
        } catch (e: any) {
          res.sendStatus(500);
        }
      }
    );

    app.delete(
      "/sharkio/sniffer/:port",
      async (req: Request, res: Response) => {
        const { port } = req.params;

        try {
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            this.snifferManager.removeSniffer(+port);
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
}
