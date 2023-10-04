import { Express, NextFunction, Request, Response, Router } from "express";
import { z } from "zod";
import { useLog } from "../log";
import { requestValidator } from "../request-validator";
import { portValidator } from "../request-validator/general-validators";
import { MockNotFoundError } from "../sniffer/mock/exceptions";
import { SnifferManager } from "./sniffer-manager";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class MockManagerController {
  constructor(
    private readonly snifferManager: SnifferManager,
    private readonly baseUrl: string = "/sharkio/sniffer",
  ) {}

  setup(app: Express) {
    const router = Router();

    /**
     * @openapi
     * /sharkio/sniffer/action/getMocks:
     *   get:
     *     tags:
     *       - mock
     *     description: Get all mocks
     *     responses:
     *       200:
     *         description: Returns all mocks
     *       500:
     *         description: Server error
     */
    router.get(
      "/action/getMocks",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const mocks = this.snifferManager.getAllMocks();
          res.json(mocks).status(200);
        } catch (e) {
          log.error("An unexpected error occured", {
            method: "GET",
            path: `${this.baseUrl}/action/getMocks`,
            error: e,
          });
          res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/mock:
     *   get:
     *     tags:
     *       - mock
     *     description: Get a mock
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
     *         description: Returns a mock
     *       404:
     *         description: Mock not found
     *       500:
     *         description: Server error
     */
    router.get(
      "/:port/mock",
      requestValidator({
        params: z.object({
          port: portValidator,
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { port } = req.params;
          const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));
          if (sniffer !== undefined) {
            const mocks = sniffer.getMockManager().getAllMocks();
            return res.send(mocks).status(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e) {
          log.error("An unexpected error occured", {
            method: "GET",
            path: `${this.baseUrl}/:port/mock`,
            error: e,
          });
          return res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/mock:
     *   post:
     *     tags:
     *       - mock
     *     description: Create a mock
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
     *        description: Create a new mock
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                method:
     *                  type: string
     *                  description: An HTTP method
     *                  enum: [GET, POST, UPDATE, DELETE, PUT ]
     *                  example: POST
     *                body:
     *                  description: The request payload
     *                  example: { someKey: "someValue" }
     *                endpoint:
     *                  type: string
     *                  description: The request URL
     *                  example: www.google.com
     *                status:
     *                  type: integer
     *                  description: An HTTP status code
     *                  example: 200
     *     responses:
     *       201:
     *         description: Mock created
     *       409:
     *         description: Mock already exists
     *       500:
     *         description: Server error
     */
    router.post(
      "/:port/mock",
      requestValidator({
        params: z.object({
          port: portValidator,
        }),
        body: z.object({
          method: z.string().nonempty(),
          endpoint: z.string().nonempty(),
          data: z.any(),
          status: z.coerce.number().positive(),
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { port } = req.params;
          const mock = req.body;

          const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));

          if (sniffer !== undefined) {
            const { id } = await sniffer.getMockManager().addMock(mock);
            return res.send(id).status(201);
          } else {
            return res.sendStatus(409);
          }
        } catch (e) {
          log.error("An unexpected error occured", {
            method: "POST",
            path: `${this.baseUrl}/:port/mock`,
            error: e,
          });
          return res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/mock:
     *  put:
     *    tags:
     *      - mock
     *    description: Updated a mock
     *    parameters:
     *       - name: port
     *         in: query
     *         schema:
     *           type: integer
     *           minimum: 0
     *           example: 8080
     *         description: service port
     *         required: true
     *    requestBody:
     *        description: Updated mock
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                mockId:
     *                  type: string
     *                  description: The id of the mock we reference
     *                  example: 6bd539be-4d3d-4101-bc99-64628640a86b
     *                method:
     *                  type: string
     *                  description: An HTTP method
     *                  enum: [GET, POST, UPDATE, DELETE, PUT ]
     *                  example: POST
     *                body:
     *                  description: The request payload
     *                  example: { someKey: "someValue" }
     *                endpoint:
     *                  type: string
     *                  description: The request URL
     *                  example: www.google.com
     *                status:
     *                  type: integer
     *                  description: An HTTP status code
     *                  example: 200
     */
    router.put(
      "/:port/mock",
      requestValidator({
        params: z.object({
          port: portValidator,
        }),
        body: z.object({
          mockId: z.string().nonempty(),
          method: z.string().nonempty(),
          endpoint: z.string().nonempty(),
          data: z.any(),
          status: z.coerce.number().positive(),
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { port } = req.params;
          const { mockId, ...mock } = req.body;

          const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));

          if (sniffer !== undefined) {
            sniffer.getMockManager().updateMock(mockId, mock);
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e: any) {
          log.error("An unexpected error occured", {
            method: "PUT",
            path: `${this.baseUrl}/:port/mock`,
            error: e,
          });
          return res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/mock:
     *   delete:
     *     tags:
     *       - mock
     *     description: Delete a mock
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
     *        description: Create a new mock
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                mockId:
     *                  type: string
     *                  description: The id of the mock we reference
     *                  example: 6bd539be-4d3d-4101-bc99-64628640a86b
     *     responses:
     *       200:
     *         description: Mock deleted
     *       404:
     *         description: Mock not found
     *       500:
     *         description: Server error
     */
    router.delete(
      "/:port/mock",
      requestValidator({
        params: z.object({
          port: portValidator,
        }),
        body: z.object({
          mockId: z.string().nonempty(),
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { port } = req.params;
          const { mockId } = req.body;

          const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));
          if (sniffer !== undefined) {
            sniffer.getMockManager().removeMock(mockId);
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e) {
          log.error("An unexpected error occured", {
            method: "DELETE",
            path: `${this.baseUrl}/:port/mock`,
            error: e,
          });
          return res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/mock/manager/actions/activate:
     *   post:
     *     tags:
     *       - mock
     *     description: Activate mock manager
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
     *        200:
     *          description: Mock has been activated for the service
     *        404:
     *          description: Mock not found
     *        500:
     *          description: Server error
     */
    router.post(
      "/:port/mock/manager/actions/activate",
      requestValidator({
        params: z.object({
          port: portValidator,
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { port } = req.params;
          const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));

          if (sniffer !== undefined) {
            sniffer.getMockManager().deactivateManager();
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e) {
          log.error("An unexpected error occured", {
            method: "POST",
            path: `${this.baseUrl}/:port/mock/manager/actions/activate`,
            error: e,
          });
          return res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/mock/manager/actions/deactivate:
     *   post:
     *     tags:
     *       - mock
     *     description: Deactivate mock manager
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
     *         description: Mock has been deactivated for the service
     *       404:
     *         description: Mock not found
     *       500:
     *         description: Server error
     */
    router.post(
      "/:port/mock/manager/actions/deactivate",
      requestValidator({
        params: z.object({
          port: portValidator,
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { port } = req.params;
          const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));

          if (sniffer !== undefined) {
            sniffer.getMockManager().deactivateManager();
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e) {
          log.error("An unexpected error occured", {
            method: "POST",
            path: `${this.baseUrl}/:port/mock/manager/actions/deactivate`,
            error: e,
          });
          return res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/mock/actions/activate:
     *   post:
     *     tags:
     *       - mock
     *     description: Activate a mock
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
     *        description: Activate a mock
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                mockId:
     *                  type: string
     *                  description: The id of the mock we reference
     *                  example: 6bd539be-4d3d-4101-bc99-64628640a86b
     *     responses:
     *       200:
     *         description: Mock activated
     *       404:
     *         description: Mock not found
     *       500:
     *         description: Server error
     */
    router.post(
      "/:port/mock/actions/activate",
      requestValidator({
        params: z.object({
          port: portValidator,
        }),
        body: z.object({
          mockId: z.string().nonempty(),
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { port } = req.params;
          const { mockId } = req.body;
          const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));

          if (sniffer !== undefined) {
            sniffer.getMockManager().activateMock(mockId);
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e) {
          switch (true) {
            case e instanceof MockNotFoundError: {
              return res.sendStatus(404);
            }
            default: {
              log.error("An unexpected error occured", {
                method: "POST",
                path: `${this.baseUrl}/:port/mock/actions/activate`,
                error: e,
              });
              return res.sendStatus(500);
            }
          }
        }
      },
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/mock/actions/deactivate:
     *   post:
     *     tags:
     *       - mock
     *     description: Deactivate a mock
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
     *        description: Deactivate a mock
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                mockId:
     *                  type: string
     *                  description: The id of the mock we reference
     *                  example: 6bd539be-4d3d-4101-bc99-64628640a86b
     *     responses:
     *       200:
     *         description: Mock deactivated
     *       404:
     *         description: Mock not found
     *       500:
     *         description: Server error
     */
    router.post(
      "/:port/mock/actions/deactivate",
      requestValidator({
        params: z.object({
          port: portValidator,
        }),
        body: z.object({
          mockId: z.string().nonempty(),
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { port } = req.params;
          const { mockId } = req.body;
          const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));

          if (sniffer !== undefined) {
            sniffer.getMockManager().deactivateMock(mockId);
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e) {
          log.error("An unexpected error occured", {
            method: "POST",
            path: `${this.baseUrl}/:port/mock/actions/deactivate`,
            error: e,
          });
          return res.sendStatus(500);
        }
      },
    );

    app.use(this.baseUrl, router);
  }
}
