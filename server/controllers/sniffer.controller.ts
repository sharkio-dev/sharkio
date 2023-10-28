import { Request, Response } from "express";
import { useLog } from "../lib/log";
import { requestValidator } from "../lib/request-validator/request-validator";
import { SnifferService } from "../services/sniffer/sniffer.service";
import { IRouterConfig } from "./router.interface";
import PromiseRouter from "express-promise-router";
import { CreateSnifferValidator } from "../dto/in/create-sniffer.dto";
import z from "zod";
import { EditSnifferValidator } from "../dto/in/index";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class SnifferController {
  constructor(
    private readonly snifferManager: SnifferService,
    private readonly baseUrl: string = "/sharkio/sniffer",
  ) {}

  getRouter(): IRouterConfig {
    const router = PromiseRouter();
    router
      .route("")
      .get(
        /**
         * @openapi
         * /sharkio/sniffer:
         *   get:
         *     tags:
         *      - sniffer
         *     description: Get all sniffers for user
         *     responses:
         *       200:
         *         description: Returns all sniffers
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response) => {
          const userId = res.locals.auth.user.id;
          res.json(await this.snifferManager.getUserSniffers(userId));
        },
      )
      .post(
        requestValidator({ body: CreateSnifferValidator }),
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
         *                  description: The name of the sniffer
         *                  example: My sniffer
         *                port:
         *                  type: number
         *                  description: The port on the sniffer will intercept on
         *                  minimum: 0
         *                  example: 8080
         *                downstreamUrl:
         *                  type: string
         *                  description: The URL the sniffer will delegate the request to
         *                  example: https://localhost
         *     responses:
         *       201:
         *         description: Sniffer created
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response) => {
          try {
            const { ...config } = req.body;
            const userId = res.locals.auth.user.id;

            const createdSniffer = await this.snifferManager.createSniffer({
              userId,
              ...config,
            });
            return res.status(201).json(createdSniffer);
          } catch (e) {
            log.error("An unexpected error occured", {
              method: "POST",
              path: `${this.baseUrl}/:id`,
              error: e,
            });
            return res.sendStatus(500);
          }
        },
      );

    router
      .route("/:id")
      .put(
        /**
         * @openapi
         * /sharkio/sniffer/{id}:
         *   put:
         *     tags:
         *      - sniffer
         *     description: Edit a sniffer
         *     parameters:
         *       - name: id
         *         in: path
         *         schema:
         *           type: string
         *         description: Sniffer id
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
        requestValidator({
          params: z.object({
            id: z.string().uuid(),
          }),
          body: EditSnifferValidator,
        }),
        async (req: Request, res: Response) => {
          try {
            const { id } = req.params;
            const data = req.body;
            const userId = res.locals.auth.user.id;
            await this.snifferManager.editSniffer({ id, userId, ...data });
            res.sendStatus(200);
          } catch (e: any) {
            log.error("An unexpected error occured", {
              method: "PUT",
              path: `${this.baseUrl}/:id`,
              error: e,
            });
            return res.sendStatus(500);
          }
        },
      )
      .delete(
        /**
         * @openapi
         * /sharkio/sniffer/{id}:
         *   delete:
         *     tags:
         *      - sniffer
         *     description: Delete a sniffer
         *     parameters:
         *       - name: id
         *         in: path
         *         schema:
         *           type: string
         *         description: Sniffer id
         *         required: true
         *     responses:
         *       200:
         *         description: Sniffer deleted
         *       404:
         *         description: Sniffer not found
         *       500:
         *         description: Server error
         */
        requestValidator({
          params: z.object({
            id: z.string().uuid(),
          }),
        }),
        async (req: Request, res: Response) => {
          try {
            const { id } = req.params;
            const userId = res.locals.auth.user.id;
            await this.snifferManager.removeSniffer(userId, id);
            res.sendStatus(200);
          } catch (e: any) {
            log.error("An unexpected error occured", {
              method: "DELETE",
              path: `${this.baseUrl}/:id`,
              error: e,
            });
            return res.sendStatus(500);
          }
        },
      )
      .get(
        /**
         * @openapi
         * /sharkio/sniffer/:id:
         *   get:
         *     tags:
         *      - sniffer
         *     description: Get all sniffers for user
         *     responses:
         *       200:
         *         description: Returns all sniffers
         *       500:
         *         description: Server error
         */
        requestValidator({
          params: z.object({
            id: z.string().uuid(),
          }),
        }),
        async (req: Request, res: Response) => {
          const snifferId = req.params.snifferId;
          const userId = res.locals.auth.user.id;
          const sniffer = await this.snifferManager.getSniffer(
            userId,
            snifferId,
          );

          res.json(sniffer);
        },
      );

    return {
      router,
      path: this.baseUrl,
    };
  }
}

// /**
//    * @openapi
//    * /sharkio/sniffer/invocation:
//    *   get:
//    *     tags:
//    *      - sniffer
//    *     description: Get all request invocation
//    *     responses:
//    *       200:
//    *         description: Returns all invocations
//    *       500:
//    *         description: Server error
//    */
// router.get("/invocation", async (req: Request, res: Response) => {
//   try {
//     const userId = res.locals.auth.user.id;
//     const stats = await this.snifferManager.stats(userId);

//     res.status(200).send(stats);
//   } catch (e) {
//     log.error("An unexpected error occured", {
//       method: "GET",
//       path: `${this.baseUrl}/invocation`,
//       error: e,
//     });
//     res.sendStatus(500);
//   }
// });

//     /**
//      * @openapi
//      * /sharkio/sniffer/:id
//      *   get:
//      *     tags:
//      *      - sniffer
//      *     description: Get a sniffer
//      *     parameters:
//      *       - name: port
//      *         in: query
//      *         schema:
//      *           type: integer
//      *           minimum: 0
//      *           example: 8080
//      *         description: service port
//      *         required: true
//      *     responses:
//      *       200:
//      *         description: Returns a sniffer
//      *       404:
//      *         description: Sniffer not found
//      *       500:
//      *         description: Server error
//      */
//     router.get(
//       "/:id",
//       requestValidator({
//         params: z.object({
//           id: portValidator,
//         }),
//       }),
//       async (req: Request, res: Response) => {
//         try {
//           const { id } = req.params;
//           const sniffer = await this.snifferManager.getSniffer(id);
//           const userId = res.locals.auth.user.id;
//           if (sniffer !== undefined) {
//             return res.send(sniffer).status(200);
//           } else {
//             return res.sendStatus(404);
//           }
//         } catch (e) {
//           log.error("An unexpected error occured", {
//             method: "GET",
//             path: `${this.baseUrl}/:id`,
//             error: e,
//           });
//           return res.sendStatus(500);
//         }
//       }
//     );

//     /**
//      * @openapi
//      * /sharkio/sniffer/:id/invocations
//      *   get:
//      *     tags:
//      *      - sniffer
//      *     description: Get invocations for a sniffer
//      *     parameters:
//      *       - name: port
//      *         in: query
//      *         schema:
//      *           type: integer
//      *           minimum: 0
//      *           example: 8080
//      *         description: service port
//      *         required: true
//      *     responses:
//      *       200:
//      *         description: Returns a sniffer
//      *       404:
//      *         description: Sniffer not found
//      *       500:
//      *         description: Server error
//      */
//     router.get(
//       "/:id",
//       requestValidator({
//         params: z.object({
//           id: portValidator,
//         }),
//       }),
//       async (req: Request, res: Response) => {
//         try {
//           const { id } = req.params;
//           const sniffer = await this.snifferManager.getSniffer(id);
//           const userId = res.locals.auth.user.id;
//           if (sniffer !== undefined) {
//             return res.send(sniffer).status(200);
//           } else {
//             return res.sendStatus(404);
//           }
//         } catch (e) {
//           log.error("An unexpected error occured", {
//             method: "GET",
//             path: `${this.baseUrl}/:id`,
//             error: e,
//           });
//           return res.sendStatus(500);
//         }
//       }
//     );

//     /**
//      * @openapi
//      * /sharkio/sniffer:
//      *   post:
//      *     tags:
//      *      - sniffer
//      *     description: Create a sniffer
//      *     requestBody:
//      *        description: Create a sniffer
//      *        content:
//      *          application/json:
//      *            schema:
//      *              type: object
//      *              required:
//      *                - name
//      *                - port
//      *                - downstreamUrl
//      *                - id
//      *              properties:
//      *                name:
//      *                  type: string
//      *                  descirption: The name of the sniffer
//      *                  example: google sniffer
//      *                port:
//      *                  type: number
//      *                  description: The port on the sniffer will intercept on
//      *                  minimum: 0
//      *                  example: 8080
//      *                downstreamUrl:
//      *                  type: string
//      *                  description: The URL the sniffer will delegate the request to
//      *                  example: www.google.com
//      *                id:
//      *                  type: string
//      *                  description: The identity of the sniffer
//      *                  example: 6bd539be-4d3d-4101-bc99-64628640a86b
//      *     responses:
//      *       201:
//      *         description: Sniffer created
//      *       500:
//      *         description: Server error
//      */
//     router.post(
//       "",
//       requestValidator({
//         body: z.object({
//           name: z.string().nonempty(),
//           port: portValidator,
//           downstreamUrl: z.string().nonempty(),
//           id: z.string().nonempty(),
//           userId: z.string().uuid(),
//         }),
//       }),
//       async (req: Request, res: Response) => {
//         try {
//           const { userId, ...config } = req.body;

//           await this.snifferManager.createSniffer(userId, config);
//           return res.sendStatus(201);
//         } catch (e) {
//           log.error("An unexpected error occured", {
//             method: "POST",
//             path: `${this.baseUrl}/:id`,
//             error: e,
//           });
//           return res.sendStatus(500);
//         }
//       }
//     );

//     /**
//      * @openapi
//      * /sharkio/sniffer/:id/actions/stop:
//      *   post:
//      *     tags:
//      *      - sniffer
//      *     description: Stop a sniffer
//      *     parameters:
//      *       - name: port
//      *         in: query
//      *         schema:
//      *           type: integer
//      *           minimum: 0
//      *           example: 8080
//      *         description: service port
//      *         required: true
//      *     responses:
//      *       200:
//      *         description: Sniffer stopped
//      *       404:
//      *         description: Sniffer not found
//      *       500:
//      *         description: Server error
//      */
//     router.post(
//       "/:id/actions/stop",
//       requestValidator({
//         params: z.object({
//           id: z.string().uuid(),
//         }),
//       }),
//       async (req: Request, res: Response) => {
//         try {
//           const { id } = req.params;
//           const sniffer = this.snifferManager.getSniffer(id);

//           if (sniffer !== undefined) {
//             sniffer.stop();
//             await this.snifferManager.setSnifferConfigToStarted(
//               sniffer.getId(),
//               false
//             );
//             return res.sendStatus(200);
//           } else {
//             return res.sendStatus(404);
//           }
//         } catch (e: any) {
//           log.error("An unexpected error occured", {
//             method: "POST",
//             path: `${this.baseUrl}/:id/actions/stop`,
//             error: e,
//           });
//           return res.sendStatus(500);
//         }
//       }
//     );

//     /**
//      * @openapi
//      * /sharkio/sniffer/:id/actions/start:
//      *   post:
//      *     tags:
//      *      - sniffer
//      *     description: Start a sniffer
//      *     parameters:
//      *       - name: port
//      *         in: query
//      *         schema:
//      *           type: integer
//      *           minimum: 0
//      *           example: 8080
//      *         description: service port
//      *         required: true
//      *     responses:
//      *       200:
//      *         description: Sniffer started
//      *       404:
//      *         description: Sniffer not found
//      *       500:
//      *         description: Server error
//      */
//     router.post(
//       "/:id/actions/start",
//       requestValidator({
//         params: z.object({
//           id: z.string().uuid(),
//         }),
//       }),
//       async (req: Request, res: Response) => {
//         try {
//           const { id } = req.params;
//           const sniffer = this.snifferManager.getSniffer(id);

//           if (sniffer) {
//             await sniffer.start();
//             await this.snifferManager.setSnifferConfigToStarted(
//               sniffer.getId(),
//               true
//             );
//             return res.sendStatus(200);
//           } else {
//             return res.sendStatus(404);
//           }
//         } catch (e: any) {
//           log.error("An unexpected error occured", {
//             method: "POST",
//             path: `${this.baseUrl}/:id/actions/start`,
//             error: e,
//           });
//           return res.sendStatus(500);
//         }
//       }
//     );

//     /**
//      * @openapi
//      * /sharkio/sniffer/:id/actions/execute:
//      *   post:
//      *     tags:
//      *      - sniffer
//      *     description: Execute a request from a sniffer
//      *     parameters:
//      *       - name: port
//      *         in: query
//      *         schema:
//      *           type: integer
//      *           minimum: 0
//      *           example: 8080
//      *         description: service port
//      *         required: true
//      *     requestBody:
//      *        description: Execute a request from a sniffer
//      *        content:
//      *          application/json:
//      *            schema:
//      *              type: object
//      *              properties:
//      *                url:
//      *                  type: string
//      *                  example: www.google.com
//      *                method:
//      *                  type: string
//      *                  description: Http status
//      *                  example: GET
//      *                  enum: [GET, POST, UPDATE, DELETE, PUT]
//      *                invocation:
//      *                  type: object
//      *                  properties:
//      *                    id:
//      *                      type: string
//      *                    timestamp:
//      *                      type: string
//      *                    body:
//      *                      description: The invocation body content
//      *                    headers:
//      *                      type: object
//      *                      properties:
//      *                        key:
//      *                          type: string
//      *                          example: value
//      *                    cookies:
//      *                      type: object
//      *                      properties:
//      *                        key:
//      *                          type: string
//      *                          example: value
//      *                    params:
//      *                      type: object
//      *                      properties:
//      *                        key:
//      *                          type: string
//      *                          example: value
//      *
//      *     responses:
//      *       200:
//      *         description: Request executed
//      *       404:
//      *         description: Sniffer not found
//      *       500:
//      *         description: Server error
//      */
//     router.post(
//       "/:id/actions/execute",
//       requestValidator({
//         params: z.object({
//           id: z.string().uuid(),
//         }),
//         body: z.object({
//           url: z.string(),
//           method: z
//             .string()
//             .toLowerCase()
//             .pipe(z.enum(["get", "post", "delete", "patch", "put"])),
//           invocation: z.object({
//             id: z.string().nonempty(),
//             timestamp: z.coerce.date(),
//             body: z.any().optional(),
//             headers: z.any().optional(),
//             cookies: z.any().optional(),
//             params: z.any().optional(),
//           }),
//         }),
//       }),
//       async (req: Request, res: Response) => {
//         try {
//           log.info("executing request");
//           const { id } = req.params;
//           const { url, method, invocation } = req.body;
//           const sniffer = this.snifferManager.getSniffer(id);

//           if (sniffer !== undefined) {
//             log.info(req.body);
//             await sniffer.execute(url, method, invocation).catch((e: Error) =>
//               log.error("Error while executing", {
//                 method: method,
//                 path: `${this.baseUrl}/:id/actions/execute`,
//                 error: e,
//               })
//             );
//             return res.sendStatus(200);
//           } else {
//             return res.sendStatus(404);
//           }
//         } catch (e: any) {
//           log.error("An unexpected error occured", {
//             method: "POST",
//             path: `${this.baseUrl}/:id/actions/execute`,
//             error: e,
//           });
//           return res.sendStatus(500);
//         }
//       }
//     );

//     /**
//      * @openapi
//      * /sharkio/sniffer/:id:
//      *   delete:
//      *     tags:
//      *      - sniffer
//      *     description: Delete a sniffer
//      *     parameters:
//      *       - name: port
//      *         in: query
//      *         schema:
//      *           type: integer
//      *           minimum: 0
//      *           example: 8080
//      *         description: service port
//      *         required: true
//      *     responses:
//      *       200:
//      *         description: Sniffer deleted
//      *       404:
//      *         description: Sniffer not found
//      *       500:
//      *         description: Server error
//      */
//     router.delete(
//       "/:id",
//       requestValidator({
//         params: z.object({
//           id: portValidator,
//         }),
//       }),
//       async (req: Request, res: Response) => {
//         try {
//           const { id } = req.params;
//           const sniffer = this.snifferManager.getSniffer(id);

//           if (sniffer !== undefined) {
//             this.snifferManager.removeSniffer(id);
//             return res.sendStatus(200);
//           } else {
//             return res.sendStatus(404);
//           }
//         } catch (e: any) {
//           log.error("An unexpected error occured", {
//             method: "DELETE",
//             path: `${this.baseUrl}/:id`,
//             error: e,
//           });
//           return res.sendStatus(500);
//         }
//       }
//     );

//     /**
//      * @openapi
//      * /sharkio/sniffer/:existingId:
//      *   put:
//      *     tags:
//      *      - sniffer
//      *     description: Edit a sniffer
//      *     parameters:
//      *       - name: existingId
//      *         in: query
//      *         schema:
//      *           type: string
//      *           example: 6bd539be-4d3d-4101-bc99-64628640a86b
//      *         description: service id
//      *         required: true
//      *     requestBody:
//      *        description: Edit a sniffer
//      *        content:
//      *          application/json:
//      *            schema:
//      *              type: object
//      *              properties:
//      *                port:
//      *                  type: integer
//      *                  minimum: 0
//      *                  example: 8080
//      *     responses:
//      *       200:
//      *         description: Sniffer edited
//      *       403:
//      *         description: The port already has an allocated sniffer
//      *       404:
//      *         description: Sniffer not found
//      *       500:
//      *         description: Server error
//      */
//     router.put(
//       "/:existingId",
//       requestValidator({
//         params: z.object({
//           existingId: z.string().nonempty(),
//         }),
//         body: z.object({
//           port: portValidator,
//         }),
//       }),
//       async (req: Request, res: Response) => {
//         try {
//           const { existingId } = req.params;
//           const { userId, ...body } = req.body;
//           const port = body.port;
//           const sniffer = this.snifferManager.getSnifferById(existingId);

//           // verify that there is no sniffer with the port you want to change to.
//           const isPortAlreadyExists = this.snifferManager.getSnifferById(
//             port.toString()
//           );

//           if (
//             (sniffer !== undefined && !isPortAlreadyExists) ||
//             port === +existingId
//           ) {
//             await this.snifferManager.editSniffer(userId, existingId, body);
//             return res.sendStatus(200);
//           } else if (!sniffer) {
//             return res.sendStatus(404);
//           } else if (isPortAlreadyExists) {
//             return res.sendStatus(403);
//           }
//         } catch (e: any) {
//           log.error("An unexpected error occured", {
//             method: "PUT",
//             path: `${this.baseUrl}/:existingId`,
//             error: e,
//           });
//           return res.sendStatus(500);
//         }
//       }
//     );
//     /**
//      * @openapi
//      * /sharkio/sniffer/invocation:
//      *   get:
//      *     tags:
//      *      - sniffer
//      *     description: Get all request invocation
//      *     responses:
//      *       200:
//      *         description: Returns all invocations
//      *       500:
//      *         description: Server error
//      */
//     router.get("/invocation", async (req: Request, res: Response) => {
//       try {
//         const userId = res.locals.auth.user.id;
//         const stats = await this.snifferManager.stats(userId);

//         res.status(200).send(stats);
//       } catch (e) {
//         log.error("An unexpected error occured", {
//           method: "GET",
//           path: `${this.baseUrl}/invocation`,
//           error: e,
//         });
//         res.sendStatus(500);
//       }
//     });

//     /**
//      * @openapi
//      * /sharkio/sniffer:
//      *   get:
//      *     tags:
//      *      - sniffer
//      *     description: Get all sniffers
//      *     responses:
//      *       200:
//      *         description: Returns all sniffers
//      *       500:
//      *         description: Server error
//      */
//     router.get("", async (req: Request, res: Response) => {
//       const userId = res.locals.auth.user.id;
//       const stats = await Promise.all(
//         (
//           await this.snifferManager.getAllSniffers(userId)
//         ).map(async (sniffer) => {
//           const { config, isStarted } = await sniffer.stats(userId);
//           return {
//             config,
//             isStarted,
//           };
//         })
//       );
//       return res.status(200).send(stats);
//     });

//     /**
//      * @openapi
//      * /sharkio/sniffer/:id
//      *   get:
//      *     tags:
//      *      - sniffer
//      *     description: Get a sniffer
//      *     parameters:
//      *       - name: port
//      *         in: query
//      *         schema:
//      *           type: integer
//      *           minimum: 0
//      *           example: 8080
//      *         description: service port
//      *         required: true
//      *     responses:
//      *       200:
//      *         description: Returns a sniffer
//      *       404:
//      *         description: Sniffer not found
//      *       500:
//      *         description: Server error
//      */
//     router.get(
//       "/:id",
//       requestValidator({
//         params: z.object({
//           id: portValidator,
//         }),
//       }),
//       async (req: Request, res: Response) => {
//         try {
//           const { id } = req.params;
//           const sniffer = await this.snifferManager.getSniffer(id);
//           const userId = res.locals.auth.user.id;
//           if (sniffer !== undefined) {
//             return res.send(sniffer).status(200);
//           } else {
//             return res.sendStatus(404);
//           }
//         } catch (e) {
//           log.error("An unexpected error occured", {
//             method: "GET",
//             path: `${this.baseUrl}/:id`,
//             error: e,
//           });
//           return res.sendStatus(500);
//         }
//       }
//     );

//     /**
//      * @openapi
//      * /sharkio/sniffer/:id/invocations
//      *   get:
//      *     tags:
//      *      - sniffer
//      *     description: Get invocations for a sniffer
//      *     parameters:
//      *       - name: port
//      *         in: query
//      *         schema:
//      *           type: integer
//      *           minimum: 0
//      *           example: 8080
//      *         description: service port
//      *         required: true
//      *     responses:
//      *       200:
//      *         description: Returns a sniffer
//      *       404:
//      *         description: Sniffer not found
//      *       500:
//      *         description: Server error
//      */
//     router.get(
//       "/:id",
//       requestValidator({
//         params: z.object({
//           id: portValidator,
//         }),
//       }),
//       async (req: Request, res: Response) => {
//         try {
//           const { id } = req.params;
//           const sniffer = await this.snifferManager.getSniffer(id);
//           const userId = res.locals.auth.user.id;
//           if (sniffer !== undefined) {
//             return res.send(sniffer).status(200);
//           } else {
//             return res.sendStatus(404);
//           }
//         } catch (e) {
//           log.error("An unexpected error occured", {
//             method: "GET",
//             path: `${this.baseUrl}/:id`,
//             error: e,
//           });
//           return res.sendStatus(500);
//         }
//       }
//     );

//     /**
//      * @openapi
//      * /sharkio/sniffer:
//      *   post:
//      *     tags:
//      *      - sniffer
//      *     description: Create a sniffer
//      *     requestBody:
//      *        description: Create a sniffer
//      *        content:
//      *          application/json:
//      *            schema:
//      *              type: object
//      *              required:
//      *                - name
//      *                - port
//      *                - downstreamUrl
//      *                - id
//      *              properties:
//      *                name:
//      *                  type: string
//      *                  descirption: The name of the sniffer
//      *                  example: google sniffer
//      *                port:
//      *                  type: number
//      *                  description: The port on the sniffer will intercept on
//      *                  minimum: 0
//      *                  example: 8080
//      *                downstreamUrl:
//      *                  type: string
//      *                  description: The URL the sniffer will delegate the request to
//      *                  example: www.google.com
//      *                id:
//      *                  type: string
//      *                  description: The identity of the sniffer
//      *                  example: 6bd539be-4d3d-4101-bc99-64628640a86b
//      *     responses:
//      *       201:
//      *         description: Sniffer created
//      *       500:
//      *         description: Server error
//      */
//     router.post(
//       "",
//       requestValidator({
//         body: z.object({
//           name: z.string().nonempty(),
//           port: portValidator,
//           downstreamUrl: z.string().nonempty(),
//           id: z.string().nonempty(),
//           userId: z.string().uuid(),
//         }),
//       }),
//       async (req: Request, res: Response) => {
//         try {
//           const { userId, ...config } = req.body;

//           await this.snifferManager.createSniffer(userId, config);
//           return res.sendStatus(201);
//         } catch (e) {
//           log.error("An unexpected error occured", {
//             method: "POST",
//             path: `${this.baseUrl}/:id`,
//             error: e,
//           });
//           return res.sendStatus(500);
//         }
//       }
//     );

//     /**
//      * @openapi
//      * /sharkio/sniffer/:id/actions/stop:
//      *   post:
//      *     tags:
//      *      - sniffer
//      *     description: Stop a sniffer
//      *     parameters:
//      *       - name: port
//      *         in: query
//      *         schema:
//      *           type: integer
//      *           minimum: 0
//      *           example: 8080
//      *         description: service port
//      *         required: true
//      *     responses:
//      *       200:
//      *         description: Sniffer stopped
//      *       404:
//      *         description: Sniffer not found
//      *       500:
//      *         description: Server error
//      */
//     router.post(
//       "/:id/actions/stop",
//       requestValidator({
//         params: z.object({
//           id: z.string().uuid(),
//         }),
//       }),
//       async (req: Request, res: Response) => {
//         try {
//           const { id } = req.params;
//           const sniffer = this.snifferManager.getSniffer(id);

//           if (sniffer !== undefined) {
//             sniffer.stop();
//             await this.snifferManager.setSnifferConfigToStarted(
//               sniffer.getId(),
//               false
//             );
//             return res.sendStatus(200);
//           } else {
//             return res.sendStatus(404);
//           }
//         } catch (e: any) {
//           log.error("An unexpected error occured", {
//             method: "POST",
//             path: `${this.baseUrl}/:id/actions/stop`,
//             error: e,
//           });
//           return res.sendStatus(500);
//         }
//       }
//     );

//     /**
//      * @openapi
//      * /sharkio/sniffer/:id/actions/start:
//      *   post:
//      *     tags:
//      *      - sniffer
//      *     description: Start a sniffer
//      *     parameters:
//      *       - name: port
//      *         in: query
//      *         schema:
//      *           type: integer
//      *           minimum: 0
//      *           example: 8080
//      *         description: service port
//      *         required: true
//      *     responses:
//      *       200:
//      *         description: Sniffer started
//      *       404:
//      *         description: Sniffer not found
//      *       500:
//      *         description: Server error
//      */
//     router.post(
//       "/:id/actions/start",
//       requestValidator({
//         params: z.object({
//           id: z.string().uuid(),
//         }),
//       }),
//       async (req: Request, res: Response) => {
//         try {
//           const { id } = req.params;
//           const sniffer = this.snifferManager.getSniffer(id);

//           if (sniffer) {
//             await sniffer.start();
//             await this.snifferManager.setSnifferConfigToStarted(
//               sniffer.getId(),
//               true
//             );
//             return res.sendStatus(200);
//           } else {
//             return res.sendStatus(404);
//           }
//         } catch (e: any) {
//           log.error("An unexpected error occured", {
//             method: "POST",
//             path: `${this.baseUrl}/:id/actions/start`,
//             error: e,
//           });
//           return res.sendStatus(500);
//         }
//       }
//     );

//     /**
//      * @openapi
//      * /sharkio/sniffer/:id/actions/execute:
//      *   post:
//      *     tags:
//      *      - sniffer
//      *     description: Execute a request from a sniffer
//      *     parameters:
//      *       - name: port
//      *         in: query
//      *         schema:
//      *           type: integer
//      *           minimum: 0
//      *           example: 8080
//      *         description: service port
//      *         required: true
//      *     requestBody:
//      *        description: Execute a request from a sniffer
//      *        content:
//      *          application/json:
//      *            schema:
//      *              type: object
//      *              properties:
//      *                url:
//      *                  type: string
//      *                  example: www.google.com
//      *                method:
//      *                  type: string
//      *                  description: Http status
//      *                  example: GET
//      *                  enum: [GET, POST, UPDATE, DELETE, PUT]
//      *                invocation:
//      *                  type: object
//      *                  properties:
//      *                    id:
//      *                      type: string
//      *                    timestamp:
//      *                      type: string
//      *                    body:
//      *                      description: The invocation body content
//      *                    headers:
//      *                      type: object
//      *                      properties:
//      *                        key:
//      *                          type: string
//      *                          example: value
//      *                    cookies:
//      *                      type: object
//      *                      properties:
//      *                        key:
//      *                          type: string
//      *                          example: value
//      *                    params:
//      *                      type: object
//      *                      properties:
//      *                        key:
//      *                          type: string
//      *                          example: value
//      *
//      *     responses:
//      *       200:
//      *         description: Request executed
//      *       404:
//      *         description: Sniffer not found
//      *       500:
//      *         description: Server error
//      */
//     router.post(
//       "/:id/actions/execute",
//       requestValidator({
//         params: z.object({
//           id: z.string().uuid(),
//         }),
//         body: z.object({
//           url: z.string(),
//           method: z
//             .string()
//             .toLowerCase()
//             .pipe(z.enum(["get", "post", "delete", "patch", "put"])),
//           invocation: z.object({
//             id: z.string().nonempty(),
//             timestamp: z.coerce.date(),
//             body: z.any().optional(),
//             headers: z.any().optional(),
//             cookies: z.any().optional(),
//             params: z.any().optional(),
//           }),
//         }),
//       }),
//       async (req: Request, res: Response) => {
//         try {
//           log.info("executing request");
//           const { id } = req.params;
//           const { url, method, invocation } = req.body;
//           const sniffer = this.snifferManager.getSniffer(id);

//           if (sniffer !== undefined) {
//             log.info(req.body);
//             await sniffer.execute(url, method, invocation).catch((e: Error) =>
//               log.error("Error while executing", {
//                 method: method,
//                 path: `${this.baseUrl}/:id/actions/execute`,
//                 error: e,
//               })
//             );
//             return res.sendStatus(200);
//           } else {
//             return res.sendStatus(404);
//           }
//         } catch (e: any) {
//           log.error("An unexpected error occured", {
//             method: "POST",
//             path: `${this.baseUrl}/:id/actions/execute`,
//             error: e,
//           });
//           return res.sendStatus(500);
//         }
//       }
//     );

//     /**
//      * @openapi
//      * /sharkio/sniffer/:id:
//      *   delete:
//      *     tags:
//      *      - sniffer
//      *     description: Delete a sniffer
//      *     parameters:
//      *       - name: port
//      *         in: query
//      *         schema:
//      *           type: integer
//      *           minimum: 0
//      *           example: 8080
//      *         description: service port
//      *         required: true
//      *     responses:
//      *       200:
//      *         description: Sniffer deleted
//      *       404:
//      *         description: Sniffer not found
//      *       500:
//      *         description: Server error
//      */
//     router.delete(
//       "/:id",
//       requestValidator({
//         params: z.object({
//           id: portValidator,
//         }),
//       }),
//       async (req: Request, res: Response) => {
//         try {
//           const { id } = req.params;
//           const sniffer = this.snifferManager.getSniffer(id);

//           if (sniffer !== undefined) {
//             this.snifferManager.removeSniffer(id);
//             return res.sendStatus(200);
//           } else {
//             return res.sendStatus(404);
//           }
//         } catch (e: any) {
//           log.error("An unexpected error occured", {
//             method: "DELETE",
//             path: `${this.baseUrl}/:id`,
//             error: e,
//           });
//           return res.sendStatus(500);
//         }
//       }
//     );

//     /**
//      * @openapi
//      * /sharkio/sniffer/:existingId:
//      *   put:
//      *     tags:
//      *      - sniffer
//      *     description: Edit a sniffer
//      *     parameters:
//      *       - name: existingId
//      *         in: query
//      *         schema:
//      *           type: string
//      *           example: 6bd539be-4d3d-4101-bc99-64628640a86b
//      *         description: service id
//      *         required: true
//      *     requestBody:
//      *        description: Edit a sniffer
//      *        content:
//      *          application/json:
//      *            schema:
//      *              type: object
//      *              properties:
//      *                port:
//      *                  type: integer
//      *                  minimum: 0
//      *                  example: 8080
//      *     responses:
//      *       200:
//      *         description: Sniffer edited
//      *       403:
//      *         description: The port already has an allocated sniffer
//      *       404:
//      *         description: Sniffer not found
//      *       500:
//      *         description: Server error
//      */
//     router.put(
//       "/:existingId",
//       requestValidator({
//         params: z.object({
//           existingId: z.string().nonempty(),
//         }),
//         body: z.object({
//           port: portValidator,
//         }),
//       }),
//       async (req: Request, res: Response) => {
//         try {
//           const { existingId } = req.params;
//           const { userId, ...body } = req.body;
//           const port = body.port;
//           const sniffer = this.snifferManager.getSnifferById(existingId);

//           // verify that there is no sniffer with the port you want to change to.
//           const isPortAlreadyExists = this.snifferManager.getSnifferById(
//             port.toString()
//           );

//           if (
//             (sniffer !== undefined && !isPortAlreadyExists) ||
//             port === +existingId
//           ) {
//             await this.snifferManager.editSniffer(userId, existingId, body);
//             return res.sendStatus(200);
//           } else if (!sniffer) {
//             return res.sendStatus(404);
//           } else if (isPortAlreadyExists) {
//             return res.sendStatus(403);
//           }
//         } catch (e: any) {
//           log.error("An unexpected error occured", {
//             method: "PUT",
//             path: `${this.baseUrl}/:existingId`,
//             error: e,
//           });
//           return res.sendStatus(500);
//         }
//       }
//     );
