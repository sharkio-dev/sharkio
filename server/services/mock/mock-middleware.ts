import { NextFunction, Request, Response } from "express";
import MockManager from "./mock-manager";

export default class MockMiddleware {
  constructor(private readonly mockManager: MockManager) {}

  async mock(req: Request, res: Response, next: NextFunction) {
    const mock = await this.mockManager.getMock(`${req.method} ${req.url}`);

    if (
      this.mockManager.getIsActive() &&
      mock !== undefined &&
      mock.active === true
    ) {
      res.status(mock.status).send(mock.data);
    } else {
      next();
    }
  }
}
