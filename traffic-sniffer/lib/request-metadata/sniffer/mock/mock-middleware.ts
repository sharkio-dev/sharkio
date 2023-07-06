import { Express, NextFunction, Request, Response } from "express";
import MockManager from "./mock-manager";

export default class MockMiddleware {
  constructor(private readonly mockManager: MockManager) {}

  mock(req: Request, res: Response, next: NextFunction) {
    const mock = this.mockManager.getMock(`${req.method} ${req.url}`);

    if (mock) {
      res.send(mock.data);
    } else {
      next();
    }
  }
}
