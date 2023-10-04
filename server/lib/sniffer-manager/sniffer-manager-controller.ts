import { Express, Request, Response, Router } from "express";
import { Sniffer } from "../sniffer/sniffer";
import { SnifferManager } from "./sniffer-manager";
import { z } from "zod";
import { requestValidator } from "../request-validator";
import { portValidator } from "../request-validator/general-validators";
import { useLog } from "../log";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class SnifferManagerController {
  constructor(
    private readonly snifferManager: SnifferManager,
    private readonly baseUrl: string = "/sharkio/sniffer",
  ) {}

  setup(app: Express) {
    const router = Router();

    /**
     * @openapi
     * /sharkio/sniffer/invocation:
     *   get:
     *     tags:
     *      - sniffer
     *     description: Get all request invocation
     *     responses:
     *       200:
     *         description: Returns all invocations
     *       500:
     *         description: Server error
     */
    router.get("/invocation", (req: Request, res: Response) => {
      try {
        res.status(200).send(this.snifferManager.stats());
      } catch (e) {
        log.error("An unexpected error occured", {
          method: "GET",
          path: `${this.baseUrl}/invocation`,
          error: e,
        });
        res.sendStatus(500);
      }
    });

    /**
     * @openapi
     * /sharkio/sniffer:
     *   get:
     *     tags:
     *      - sniffer
     *     description: Get all sniffers
     *     responses:
     *       200:
     *         description: Returns all sniffers
     *       500:
     *         description: Server error
     */
    router.get("", (req: Request, res: Response) => {
      return res.status(200).send(
        this.snifferManager.getAllSniffers().map((sniffer: Sniffer) => {
          const { config, isStarted } = sniffer.stats();
          return {
            config,
            isStarted,
          };
        }),
      );
    });

    /**
     * @openapi
     * /sharkio/sniffer/:port:
     *   get:
     *     tags:
     *      - sniffer
     *     description: Get a sniffers
     *     parameters:
     *       - name: port
     *         in: query
     *         schema:
     *           type: integer
     *           minimum: 0
     *           example: 8080
     *         description: service port
     *         required: true
     *     responses:
     *       200:
     *         description: Returns a sniffer
     *       404:
     *         description: Sniffer not found
     *       500:
     *         description: Server error
     */
    router.get(
      "/:port",
      requestValidator({
        params: z.object({
          port: portValidator,
        }),
      }),
      (req: Request, res: Response) => {
        try {
          const { port } = req.params;
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            return res.send(sniffer.stats()).status(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e) {
          log.error("An unexpected error occured", {
            method: "GET",
            path: `${this.baseUrl}/:port`,
            error: e,
          });
          return res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     * /sharkio/sniffer:
     *   post:
     *     tags:
     *      - sniffer
     *     description: Create a sniffer
     *     requestBody:
     *        description: Create a sniffer
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              required:
     *                - name
     *                - port
     *                - downstreamUrl
     *                - id
     *              properties:
     *                name:
     *                  type: string
     *                  descirption: The name of the sniffer
     *                  example: google sniffer
     *                port:
     *                  type: number
     *                  description: The port on the sniffer will intercept on
     *                  minimum: 0
     *                  example: 8080
     *                downstreamUrl:
     *                  type: string
     *                  description: The URL the sniffer will delegate the request to
     *                  example: www.google.com
     *                id:
     *                  type: string
     *                  description: The identity of the sniffer
     *                  example: 6bd539be-4d3d-4101-bc99-64628640a86b
     *     responses:
     *       201:
     *         description: Sniffer created
     *       500:
     *         description: Server error
     */
    router.post(
      "",
      requestValidator({
        body: z.object({
          name: z.string().nonempty(),
          port: portValidator,
          downstreamUrl: z.string().nonempty(),
          id: z.string().nonempty(),
        }),
      }),
      (req: Request, res: Response) => {
        try {
          const config = req.body;
          this.snifferManager.createSniffer(config);
          return res.sendStatus(201);
        } catch (e) {
          log.error("An unexpected error occured", {
            method: "POST",
            path: `${this.baseUrl}/:port`,
            error: e,
          });
          return res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/actions/stop:
     *   post:
     *     tags:
     *      - sniffer
     *     description: Stop a sniffer
     *     parameters:
     *       - name: port
     *         in: query
     *         schema:
     *           type: integer
     *           minimum: 0
     *           example: 8080
     *         description: service port
     *         required: true
     *     responses:
     *       200:
     *         description: Sniffer stopped
     *       404:
     *         description: Sniffer not found
     *       500:
     *         description: Server error
     */
    router.post(
      "/:port/actions/stop",
      requestValidator({
        params: z.object({
          port: portValidator,
        }),
      }),
      (req: Request, res: Response) => {
        try {
          const { port } = req.params;
          const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));

          if (sniffer !== undefined) {
            sniffer.stop();
            this.snifferManager.setSnifferConfigToStarted(
              sniffer.getId(),
              false,
            );
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e: any) {
          log.error("An unexpected error occured", {
            method: "POST",
            path: `${this.baseUrl}/:port/actions/stop`,
            error: e,
          });
          return res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/actions/start:
     *   post:
     *     tags:
     *      - sniffer
     *     description: Start a sniffer
     *     parameters:
     *       - name: port
     *         in: query
     *         schema:
     *           type: integer
     *           minimum: 0
     *           example: 8080
     *         description: service port
     *         required: true
     *     responses:
     *       200:
     *         description: Sniffer started
     *       404:
     *         description: Sniffer not found
     *       500:
     *         description: Server error
     */
    router.post(
      "/:port/actions/start",
      requestValidator({
        params: z.object({
          port: portValidator,
        }),
      }),
      async (req: Request, res: Response) => {
        try {
          const { port } = req.params;
          const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));

          if (sniffer) {
            await sniffer.start();
            this.snifferManager.setSnifferConfigToStarted(
              sniffer.getId(),
              true,
            );
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e: any) {
          log.error("An unexpected error occured", {
            method: "POST",
            path: `${this.baseUrl}/:port/actions/start`,
            error: e,
          });
          return res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/actions/execute:
     *   post:
     *     tags:
     *      - sniffer
     *     description: Execute a request from a sniffer
     *     parameters:
     *       - name: port
     *         in: query
     *         schema:
     *           type: integer
     *           minimum: 0
     *           example: 8080
     *         description: service port
     *         required: true
     *     requestBody:
     *        description: Execute a request from a sniffer
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                url:
     *                  type: string
     *                  example: www.google.com
     *                method:
     *                  type: string
     *                  description: Http status
     *                  example: GET
     *                  enum: [GET, POST, UPDATE, DELETE, PUT]
     *                invocation:
     *                  type: object
     *                  properties:
     *                    id:
     *                      type: string
     *                    timestamp:
     *                      type: string
     *                    body:
     *                      description: The invocation body content
     *                    headers:
     *                      type: object
     *                      properties:
     *                        key:
     *                          type: string
     *                          example: value
     *                    cookies:
     *                      type: object
     *                      properties:
     *                        key:
     *                          type: string
     *                          example: value
     *                    params:
     *                      type: object
     *                      properties:
     *                        key:
     *                          type: string
     *                          example: value
     *
     *     responses:
     *       200:
     *         description: Request executed
     *       404:
     *         description: Sniffer not found
     *       500:
     *         description: Server error
     */
    router.post(
      "/:port/actions/execute",
      requestValidator({
        params: z.object({
          port: portValidator,
        }),
        body: z.object({
          url: z.string(),
          method: z
            .string()
            .toLowerCase()
            .pipe(z.enum(["get", "post", "delete", "patch", "put"])),
          invocation: z.object({
            id: z.string().nonempty(),
            timestamp: z.coerce.date(),
            body: z.any().optional(),
            headers: z.any().optional(),
            cookies: z.any().optional(),
            params: z.any().optional(),
          }),
        }),
      }),
      async (req: Request, res: Response) => {
        try {
          log.info("executing request");
          const { port } = req.params;
          const { url, method, invocation } = req.body;
          const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));

          if (sniffer !== undefined) {
            log.info(req.body);
            await sniffer.execute(url, method, invocation).catch((e) =>
              log.error("Error while executing", {
                method: method,
                path: `${this.baseUrl}/:port/actions/execute`,
                error: e,
              }),
            );
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e: any) {
          log.error("An unexpected error occured", {
            method: "POST",
            path: `${this.baseUrl}/:port/actions/execute`,
            error: e,
          });
          return res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port:
     *   delete:
     *     tags:
     *      - sniffer
     *     description: Delete a sniffer
     *     parameters:
     *       - name: port
     *         in: query
     *         schema:
     *           type: integer
     *           minimum: 0
     *           example: 8080
     *         description: service port
     *         required: true
     *     responses:
     *       200:
     *         description: Sniffer deleted
     *       404:
     *         description: Sniffer not found
     *       500:
     *         description: Server error
     */
    router.delete(
      "/:port",
      requestValidator({
        params: z.object({
          port: portValidator,
        }),
      }),
      async (req: Request, res: Response) => {
        try {
          const { port } = req.params;
          const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));

          if (sniffer !== undefined) {
            this.snifferManager.removeSniffer(Number.parseInt(port));
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e: any) {
          log.error("An unexpected error occured", {
            method: "DELETE",
            path: `${this.baseUrl}/:port`,
            error: e,
          });
          return res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     * /sharkio/sniffer/:existingId:
     *   put:
     *     tags:
     *      - sniffer
     *     description: Edit a sniffer
     *     parameters:
     *       - name: existingId
     *         in: query
     *         schema:
     *           type: string
     *           example: 6bd539be-4d3d-4101-bc99-64628640a86b
     *         description: service id
     *         required: true
     *     requestBody:
     *        description: Edit a sniffer
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                port:
     *                  type: integer
     *                  minimum: 0
     *                  example: 8080
     *     responses:
     *       200:
     *         description: Sniffer edited
     *       403:
     *         description: The port already has an allocated sniffer
     *       404:
     *         description: Sniffer not found
     *       500:
     *         description: Server error
     */
    router.put(
      "/:existingId",
      requestValidator({
        params: z.object({
          existingId: z.string().nonempty(),
        }),
        body: z.object({
          port: portValidator,
        }),
      }),
      async (req: Request, res: Response) => {
        try {
          const { existingId } = req.params;
          const { port } = req.body;
          const sniffer = this.snifferManager.getSnifferById(existingId);

          // verify that there is no sniffer with the port you want to change to.
          const isPortAlreadyExists = this.snifferManager.getSnifferById(
            port.toString(),
          );

          if (
            (sniffer !== undefined && !isPortAlreadyExists) ||
            port === +existingId
          ) {
            await this.snifferManager.editSniffer(existingId, req.body);
            return res.sendStatus(200);
          } else if (!sniffer) {
            return res.sendStatus(404);
          } else if (isPortAlreadyExists) {
            return res.sendStatus(403);
          }
        } catch (e: any) {
          log.error("An unexpected error occured", {
            method: "PUT",
            path: `${this.baseUrl}/:existingId`,
            error: e,
          });
          return res.sendStatus(500);
        }
      },
    );

    app.use(this.baseUrl, router);
  }
}
