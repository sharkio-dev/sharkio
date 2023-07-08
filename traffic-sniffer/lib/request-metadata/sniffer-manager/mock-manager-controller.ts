import { Express, NextFunction, Request, Response } from "express";
import { SnifferManager } from "./sniffer-manager";
import { MockNotFoundError } from "../sniffer/mock/exceptions";

export class MockManagerController {
  constructor(private readonly snifferManager: SnifferManager) {}

  setup(app: Express) {
    app.get(
      "/sharkio/sniffer/action/getMocks",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const mocks = this.snifferManager.getAllMocks();
          res.json(mocks).status(200);
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
        }
      }
    );

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
      "/sharkio/sniffer/:port/mock",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { port } = req.params;
          const { mockId } = req.body;

          const sniffer = this.snifferManager.getSniffer(+port);
          if (sniffer !== undefined) {
            await sniffer.getMockManager().removeMock(mockId);

            res.sendStatus(200);
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
      "/sharkio/sniffer/:port/mock/manager/actions/activate",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { port } = req.params;
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            await sniffer.getMockManager().deactivateManager();

            res.status(200);
          } else {
            res.sendStatus(404);
          }
          res.sendStatus(200);
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
        }
      }
    );

    app.post(
      "/sharkio/sniffer/:port/mock/manager/actions/deactivate",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { port } = req.params;
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            await sniffer.getMockManager().deactivateManager();

            res.status(200);
          } else {
            res.sendStatus(404);
          }
          res.sendStatus(200);
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
        }
      }
    );

    app.post(
      "/sharkio/sniffer/:port/mock/actions/activate",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { port } = req.params;
          const { mockId } = req.body;
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            await sniffer.getMockManager().activateMock(mockId);

            res.status(200);
          } else {
            res.sendStatus(404);
          }
          res.sendStatus(200);
        } catch (e) {
          if (e instanceof MockNotFoundError) {
            res.sendStatus(404);
          } else {
            console.error(e);
            res.sendStatus(500);
          }
        }
      }
    );

    app.post(
      "/sharkio/sniffer/:port/mock/actions/deactivate",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { port } = req.params;
          const { mockId } = req.body;
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            await sniffer.getMockManager().deactivateMock(mockId);

            res.status(200);
          } else {
            res.sendStatus(404);
          }
          res.sendStatus(200);
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
        }
      }
    );
  }
}
