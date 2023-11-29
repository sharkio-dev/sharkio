import { NextFunction, Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import { useLog } from "../lib/log";
import { MockService } from "../services/mock/mock.service";
import { IRouterConfig } from "./router.interface";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class MockController {
  constructor(private readonly mockService: MockService) {}

  getRouter(): IRouterConfig {
    const router = PromiseRouter();
    router.route("/").get(
      /**
       * @openapi
       * /sharkio/mock:
       *   get:
       *     tags:
       *      - mock
       *     description: Get all mocks
       *     responses:
       *       200:
       *         description: Returns mocks
       *       500:
       *         description: Server error
       */
      async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.auth.user.id;
        const limit = +(req.params.limit ?? 1000);
        const requests = await this.mockService.getByUser(userId, limit);
        res.status(200).send(requests);
      }
    );

    return { router, path: "/sharkio/mock" };
  }
}
