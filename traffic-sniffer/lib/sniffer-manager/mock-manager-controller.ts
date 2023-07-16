import { Express, NextFunction, Request, Response } from "express";
import { SnifferManager } from "./sniffer-manager";
import { MockNotFoundError } from "../sniffer/mock/exceptions";
import { z, ZodError } from "zod";

export class MockManagerController {
  constructor(private readonly snifferManager: SnifferManager) {}

  setup(app: Express) {
    const portValidator = z.coerce
      .number()
      .nonnegative("Port number cannot be negative");

    /**
     * @openapi
     * /sharkio/sniffer/action/getMocks:
     *   get:
     *     tags:
     *      - mock
     *     description: Get all mocks
     *     responses:
     *       200:
     *         description: Returns a all mocks.
     *       500:
     *         description: Server error
     */
    app.get(
      "/sharkio/sniffer/action/getMocks",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const mocks = this.snifferManager.getAllMocks();
          res.json(mocks).status(200);
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
        }
      }
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/mock:
     *   get:
     *     tags:
     *      - mock
     *     description: Get a mock
     *     parameters:
     *       - name: port
     *         in: query
     *         description: service port
     *         required: true
     *     responses:
     *       200:
     *         description: Returns a mock.
     *       500:
     *         description: Server error
     */
    app.get(
      "/sharkio/sniffer/:port/mock",
      async (req: Request, res: Response, next: NextFunction) => {
        const paramsValidator = z.object({
          port: portValidator,
        });

        try {
          const { port } = paramsValidator.parse(req.params);

          const sniffer = this.snifferManager.getSniffer(port);
          if (sniffer !== undefined) {
            const mocks = sniffer.getMockManager().getAllMocks();
            return res.send(mocks).status(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e) {
          switch (true) {
            case e instanceof ZodError: {
              const { errors } = e as ZodError;
              return res.status(400).send(errors);
            }
            default: {
              console.error("An unexpected error occured", {
                dir: __dirname,
                file: __filename,
                method: "GET",
                path: "/sharkio/sniffer/:port/mock",
                error: e,
                timestamp: new Date(),
              });
              return res.sendStatus(500);
            }
          }
        }
      }
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/mock:
     *   post:
     *     tags:
     *      - mock
     *     description: Create a mock
     *     parameters:
     *       - name: port
     *         in: query
     *         description: service port
     *         required: true
     *     requestBody:
     *        description: Create a new mock
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *     responses:
     *       201:
     *         description: Mock created
     *       500:
     *         description: Server error
     */
    app.post(
      "/sharkio/sniffer/:port/mock",
      async (req: Request, res: Response, next: NextFunction) => {
        const paramsValidator = z.object({
          port: portValidator,
        });
        // A bit of an issue with the z.any()

        // const bodyValidator = z.object({
        //   method: z.string().nonempty(),
        //   endpoint: z.string().nonempty(),
        //   data: z.any(),
        //   status: z.number().positive(),
        // });

        try {
          const { port } = paramsValidator.parse(req.params);
          const mock = req.body;

          const sniffer = this.snifferManager.getSniffer(port);

          if (sniffer !== undefined) {
            const { id } = await sniffer.getMockManager().addMock(mock);
            return res.send(id).status(201);
          } else {
            return res.sendStatus(404);
          }
        } catch (e) {
          switch (true) {
            case e instanceof ZodError: {
              const { errors } = e as ZodError;
              return res.status(400).send(errors);
            }
            default: {
              console.error("An unexpected error occured", {
                dir: __dirname,
                file: __filename,
                method: "POST",
                path: "/sharkio/sniffer/:port/mock",
                error: e,
                timestamp: new Date(),
              });
              return res.sendStatus(500);
            }
          }
        }
      }
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/mock:
     *   delete:
     *     tags:
     *      - mock
     *     description: Delete a mock
     *     parameters:
     *       - name: port
     *         in: query
     *         description: service port
     *         required: true
     *     requestBody:
     *        description: Create a new mock
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *     responses:
     *       200:
     *         description: mock deleted.
     *       500:
     *         description: Server error
     */
    app.delete(
      "/sharkio/sniffer/:port/mock",
      async (req: Request, res: Response, next: NextFunction) => {
        const paramsValidator = z.object({
          port: portValidator,
        });
        const bodyValidator = z.object({
          mockId: z.string().nonempty(),
        });
        try {
          const { port } = paramsValidator.parse(req.params);
          const { mockId } = bodyValidator.parse(req.body);

          const sniffer = this.snifferManager.getSniffer(port);
          if (sniffer !== undefined) {
            sniffer.getMockManager().removeMock(mockId);
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e) {
          switch (true) {
            case e instanceof ZodError: {
              const { errors } = e as ZodError;
              return res.status(400).send(errors);
            }
            default: {
              console.error("An unexpected error occured", {
                dir: __dirname,
                file: __filename,
                method: "DELETE",
                path: "/sharkio/sniffer/:port/mock",
                error: e,
                timestamp: new Date(),
              });
              return res.sendStatus(500);
            }
          }
        }
      }
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/mock/manager/actions/activate:
     *   post:
     *     tags:
     *      - mock
     *     description: Activate mock manager
     *     parameters:
     *       - name: port
     *         in: query
     *         description: service port
     *         required: true
     *     requestBody:
     *        description: Activate mock manager
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *     responses:
     *       200:
     *         description: Mock manager are activated
     *       500:
     *         description: Server error
     */
    app.post(
      "/sharkio/sniffer/:port/mock/manager/actions/activate",
      async (req: Request, res: Response, next: NextFunction) => {
        const paramsValidator = z.object({
          port: portValidator,
        });
        try {
          const { port } = paramsValidator.parse(req.params);
          const sniffer = this.snifferManager.getSniffer(port);

          if (sniffer !== undefined) {
            sniffer.getMockManager().deactivateManager();
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e) {
          switch (true) {
            case e instanceof ZodError: {
              const { errors } = e as ZodError;
              return res.status(400).send(errors);
            }
            default: {
              console.error("An unexpected error occured", {
                dir: __dirname,
                file: __filename,
                method: "POST",
                path: "/sharkio/sniffer/:port/mock/manager/actions/activate",
                error: e,
                timestamp: new Date(),
              });
              return res.sendStatus(500);
            }
          }
        }
      }
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/mock/manager/actions/deactivate:
     *   post:
     *     tags:
     *      - mock
     *     description: Deactivate mock manager
     *     parameters:
     *       - name: port
     *         in: query
     *         description: service port
     *         required: true
     *     requestBody:
     *        description: Deactivate mock manager
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *     responses:
     *       200:
     *         description: Mock manager deactivated for the service
     *       500:
     *         description: Server error
     */
    app.post(
      "/sharkio/sniffer/:port/mock/manager/actions/deactivate",
      async (req: Request, res: Response, next: NextFunction) => {
        const paramsValidator = z.object({
          port: portValidator,
        });
        try {
          const { port } = paramsValidator.parse(req.params);
          const sniffer = this.snifferManager.getSniffer(port);

          if (sniffer !== undefined) {
            sniffer.getMockManager().deactivateManager();
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e) {
          switch (true) {
            case e instanceof ZodError: {
              const { errors } = e as ZodError;
              return res.status(400).send(errors);
            }
            default: {
              console.error("An unexpected error occured", {
                dir: __dirname,
                file: __filename,
                method: "POST",
                path: "/sharkio/sniffer/:port/mock/manager/actions/deactivate",
                error: e,
                timestamp: new Date(),
              });
              return res.sendStatus(500);
            }
          }
        }
      }
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/mock/actions/activate:
     *   post:
     *     tags:
     *      - mock
     *     description: Activate a mock
     *     parameters:
     *       - name: port
     *         in: query
     *         description: service port
     *         required: true
     *     requestBody:
     *        description: Activate a mock
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *     responses:
     *       200:
     *         description: Mock activated
     *       500:
     *         description: Server error
     */
    app.post(
      "/sharkio/sniffer/:port/mock/actions/activate",
      async (req: Request, res: Response, next: NextFunction) => {
        const paramsValidator = z.object({
          port: portValidator,
        });

        const bodyValidator = z.object({
          mockId: z.string().nonempty(),
        });
        try {
          const { port } = paramsValidator.parse(req.params);
          const { mockId } = bodyValidator.parse(req.body);
          const sniffer = this.snifferManager.getSniffer(port);

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
            case e instanceof ZodError: {
              const { errors } = e as ZodError;
              return res.status(400).send(errors);
            }
            default: {
              console.error("An unexpected error occured", {
                dir: __dirname,
                file: __filename,
                method: "POST",
                path: "/sharkio/sniffer/:port/mock/actions/activate",
                error: e,
                timestamp: new Date(),
              });
              return res.sendStatus(500);
            }
          }
        }
      }
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/mock/actions/deactivate:
     *   post:
     *     tags:
     *      - mock
     *     description: Deactivate a mock
     *     parameters:
     *       - name: port
     *         in: query
     *         description: service port
     *         required: true
     *     requestBody:
     *        description: Deactivate a mock
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *     responses:
     *       200:
     *         description: Mock Deactivated
     *       500:
     *         description: Server error
     */
    app.post(
      "/sharkio/sniffer/:port/mock/actions/deactivate",
      async (req: Request, res: Response, next: NextFunction) => {
        const paramsValidator = z.object({
          port: portValidator,
        });
        const bodyValidator = z.object({
          mockId: z.string().nonempty(),
        });

        try {
          const { port } = paramsValidator.parse(req.params);
          const { mockId } = bodyValidator.parse(req.body);
          const sniffer = this.snifferManager.getSniffer(port);

          if (sniffer !== undefined) {
            sniffer.getMockManager().deactivateMock(mockId);
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e) {
          switch (true) {
            case e instanceof ZodError: {
              const { errors } = e as ZodError;
              return res.status(400).send(errors);
            }
            default: {
              console.error("An unexpected error occured", {
                dir: __dirname,
                file: __filename,
                method: "POST",
                path: "/sharkio/sniffer/:port/mock/actions/deactivate",
                error: e,
                timestamp: new Date(),
              });
              return res.sendStatus(500);
            }
          }
        }
      }
    );
  }
}
