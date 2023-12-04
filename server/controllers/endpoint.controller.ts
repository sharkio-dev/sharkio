import { NextFunction, Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import { useLog } from "../lib/log";
import { EndpointService } from "../services/endpoint/endpoint.service";
import { SnifferService } from "../services/sniffer/sniffer.service";
import { IRouterConfig } from "./router.interface";
import { RequestService } from "../services/request/request.service";
import axios from "axios";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class EndpointController {
  constructor(
    private readonly endpointService: EndpointService,
    private readonly snifferService: SnifferService,
    private readonly requestService: RequestService
  ) {}

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
        const limit = +(req.params.limit ?? 1000);
        const requests = await this.endpointService.getByUser(userId, limit);
        res.status(200).send(requests);
      }
    );

    router.route("/:requestId/invocation").get(
      /**
       * @openapi
       * /sharkio/request/{requestId}/invocation:
       *   get:
       *     tags:
       *      - request
       *     parameters:
       *       - name: requestId
       *         in: path
       *         schema:
       *           type: string
       *         description: Request id
       *         required: true
       *     description: Get all requests
       *     responses:
       *       200:
       *         description: Returns requests
       *       500:
       *         description: Server error
       */
      async (req, res) => {
        const request = await this.endpointService.getById(
          req.params.requestId
        );
        if (request === null) {
          return res.status(404).send("Request not found");
        }

        const requests =
          (await this.endpointService.getInvocations(request)) || [];
        res.status(200).send(requests);
      }
    );

    router.route("/execute").post(
      /**
       * @openapi
       * /sharkio/request/execute:
       *   post:
       *     requestBody:
       *        description: Execute a request
       *        content:
       *          application/json:
       *            schema:
       *              type: object
       *              properties:
       *                body:
       *                  type: object
       *                headers:
       *                  type: object
       *                url:
       *                  type: string
       *                method:
       *                  type: string
       *
       *     tags:
       *      - request
       *     description: executes a request
       *     responses:
       *       200:
       *         description: request was successfully executed
       *       500:
       *         description: Server error
       */
      async (req, res) => {
        try {
          const { method, headers, body, url, snifferId } = req.body;
          if (!snifferId) {
            return res.status(400).send("Sniffer id is required");
          }
          if (!url) {
            return res.status(400).send("Url is required");
          }
          if (!method) {
            return res.status(400).send("Method is required");
          }
          const sniffer = await this.snifferService.getSniffer(
            res.locals.auth.userId,
            snifferId
          );
          if (!sniffer) {
            return res.status(404).send("Sniffer not found");
          }

          let newHeaders = headers ?? {};

          const response = await this.requestService.execute({
            method,
            url,
            headers: newHeaders,
            body,
            subdomain: sniffer.subdomain,
          });
          console.log({
            data: response?.data,
            headers: response?.headers,
            status: response?.status,
          });
          res.status(200).send({
            data: response?.data,
            headers: response?.headers,
            status: response?.status,
          });
        } catch (e) {
          log.error(e);
          res.status(500).send("Internal server error");
        }
      }
    );

    return { router, path: "/sharkio/request" };
  }
}
