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
        const limit = 100;
        const requests = await this.endpointService.getInvocationsByUser(
          userId,
          limit,
        );
        res.status(200).send(requests);
      },
    );

    router.route("/:id").get(
      /**
       * @openapi
       * /sharkio/invocation/{id}:
       *   get:
       *     tags:
       *      - invocation
       *     description: Get invocation by id
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema:
       *           type: string
       *     responses:
       *       200:
       *         description: Returns invocation
       *       500:
       *         description: Server error
       */
      async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.auth.user.id;
        const { id } = req.params;
        const request = await this.endpointService.getInvocationById(
          id,
          userId,
        );
        res.status(200).send(request);
      },
    );

    return { router, path: "/sharkio/invocation" };
  }
}
