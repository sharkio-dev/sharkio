import { NextFunction, Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import { useLog } from "../lib/log";
import { EndpointService } from "../services/endpoint/endpoint.service";
import { IRouterConfig } from "./router.interface";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class InvocationController {
  constructor(private readonly endpointService: EndpointService) {}

  getRouter(): IRouterConfig {
    const router = PromiseRouter();
    router.route("/").get(
      /**
       * @openapi
       * /sharkio/invocation:
       *   get:
       *     tags:
       *      - invocation
       *     description: Get all invocations
       *     responses:
       *       200:
       *         description: Returns invocations
       *       500:
       *         description: Server error
       */
      async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.auth.user.id;
        const limit = +(req.params.limit ?? 1000);
        const requests = await this.endpointService.getInvocationsByUser(
          userId,
          limit
        );
        res.status(200).send(requests);
      }
    );

    return { router, path: "/sharkio/invocation" };
  }
}
