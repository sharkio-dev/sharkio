import { NextFunction, Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import { useLog } from "../lib/log";
import { IRouterConfig } from "./router.interface";
import { RequestService } from "../services/request/request.service";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  getRouter(): IRouterConfig {
    const router = PromiseRouter();
    router.route("/").get(
      /**
       * @openapi
       * /sharkio/request:
       *   get:
       *     tags:
       *      - request
       *     description: Get all requests
       *     responses:
       *       200:
       *         description: Returns requests
       *       500:
       *         description: Server error
       */
      async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.auth.user.id;

        const requests = await this.requestService.getByUser(userId);
        res.status(200).send(requests);
      }
    );

    router.route("/:requestId/invocation").get(async (req, res) => {
      const request = await this.requestService.getById(req.params.requestId);
      if (request === null) {
        return res.status(404).send("Request not found");
      }

      const requests =
        (await this.requestService.getInvocations(request)) || [];
      res.status(200).send(requests);
    });

    router.route("/:snifferId/requests-tree").get(async (req, res) => {
      const result = await this.requestService.getRequestsTree(
        req.params.snifferId
      );

      res.status(200).send(result);
    });

    return { router, path: "/sharkio/request" };
  }
}
