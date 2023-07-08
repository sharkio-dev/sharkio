import { Express, NextFunction, Request, Response } from "express";
import MockManager from "./mock-manager";

export default class MockController {
  constructor(private readonly mockManager: MockManager) {}

  setup(app: Express) {
    app.get(
      "/sharkio/mock",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const mocks = this.mockManager.getAllMocks();
          res.send(mocks).status(200);
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
        }
      }
    );

    app.post(
      "/sharkio/mock",
      async (req: Request, res: Response, next: NextFunction) => {
        const mock = req.body;

        try {
          const { id } = await this.mockManager.addMock(mock);

          res.send(id).status(200);
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
        }
      }
    );

    app.post(
      "/sharkio/mock/actions/activate",
      async (req: Request, res: Response, next: NextFunction) => {
        const mock = req.body;

        try {
          await this.mockManager.activateManager();

          res.sendStatus(200);
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
        }
      }
    );

    app.post(
      "/sharkio/mock/actions/deactivate",
      async (req: Request, res: Response, next: NextFunction) => {
        const mock = req.body;

        try {
          await this.mockManager.deactivateManager();

          res.sendStatus(200);
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
        }
      }
    );

    app.delete(
      "/sharkio/mock/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { id } = req.body;
          this.mockManager.removeMock(id);
          res.send().status(200);
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
        }
      }
    );
  }
}
