import { Express, NextFunction, Request, Response } from "express";
import MockManager from "./mock-manager";
import { useLog } from "../../log";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export default class MockController {
  constructor(private readonly mockManager: MockManager) {}

  setup(app: Express) {
    app.get(
      "/sharkio/mock",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const mocks = this.mockManager.getAllMocks();
          return res.send(mocks).status(200);
        } catch (e) {
          log.error("An unexpected error occurred", {
            method: "GET",
            path: "/sharkio/mock",
            error: e,
          });
          return res.sendStatus(500);
        }
      }
    );

    app.post(
      "/sharkio/mock",
      async (req: Request, res: Response, next: NextFunction) => {
        const mock = req.body;

        try {
          const { id } = await this.mockManager.addMock(mock);
          return res.send(id).status(200);
        } catch (e) {
          log.error("An unexpected error occurred", {
            method: "POST",
            path: "/sharkio/mock",
            error: e,
          });
          return res.sendStatus(500);
        }
      }
    );

    app.post(
      "/sharkio/mock/actions/activate",
      async (req: Request, res: Response, next: NextFunction) => {
        const mock = req.body;

        try {
          this.mockManager.activateManager();
          return res.sendStatus(200);
        } catch (e) {
          log.error("An unexpected error occurred", {
            method: "POST",
            url: "/sharkio/mock/actions/activate",
            error: e,
          });
          return res.sendStatus(500);
        }
      }
    );

    app.post(
      "/sharkio/mock/actions/deactivate",
      async (req: Request, res: Response, next: NextFunction) => {
        const mock = req.body;

        try {
          this.mockManager.deactivateManager();
          return res.sendStatus(200);
        } catch (e) {
          log.error("An unexpected error occurred", {
            method: "POST",
            url: "/sharkio/mock/actions/deactivate",
            error: e,
          });
          return res.sendStatus(500);
        }
      }
    );

    app.delete(
      "/sharkio/mock/:id",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { id } = req.body;
          this.mockManager.removeMock(id);
          return res.sendStatus(200);
        } catch (e) {
          log.error("An unexpected error occured", {
            method: "DELETE",
            url: "/sharkio/mock/:id",
            error: e,
          });
          return res.sendStatus(500);
        }
      }
    );
  }
}
