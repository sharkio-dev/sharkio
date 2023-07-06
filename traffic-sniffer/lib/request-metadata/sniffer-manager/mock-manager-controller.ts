import { Express, NextFunction, Request, Response } from "express";
import { SnifferManager } from "./sniffer-manager";

export class MockManagerController {
  constructor(private readonly snifferManager: SnifferManager) {}

  setup(app: Express) {
    app.get(
      "/sharkio/sniffer/:port/mock",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { port } = req.params;

          const sniffer = this.snifferManager.getSniffer(+port);
          if (sniffer !== undefined) {
            const mocks = sniffer.getMockManager().getAllMocks();
            res.send(mocks).status(200);
          } else {
            res.sendStatus(404);
          }
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
        }
      }
    );

    app.post(
      "/sharkio/sniffer/:port/mock",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { port } = req.params;
          const mock = req.body;

          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            const { id } = await sniffer.getMockManager().addMock(mock);
            res.send(id).status(200);
          } else {
            res.sendStatus(404);
          }
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
        }
      }
    );

    app.delete(
      "/sharkio/sniffer/:port/mock/:mockId",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { port, mockId } = req.params;

          const sniffer = this.snifferManager.getSniffer(+port);
          if (sniffer !== undefined) {
            await sniffer.getMockManager().removeMock(mockId);

            res.status(200);
          } else {
            res.sendStatus(404);
          }
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
        }
      }
    );
  }
}
