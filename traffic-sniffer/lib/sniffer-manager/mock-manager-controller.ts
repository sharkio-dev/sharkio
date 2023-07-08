import { Express, NextFunction, Request, Response } from "express";
import { SnifferManager } from "./sniffer-manager";
import { MockNotFoundError } from "../sniffer/mock/exceptions";

export class MockManagerController {
  constructor(private readonly snifferManager: SnifferManager) {}

  setup(app: Express) {
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
        try {
          const { port } = req.params;

          const sniffer = this.snifferManager.getSniffer(+port);
          if (sniffer !== undefined) {
            const mocks = sniffer.getMockManager().getAllMocks();
            res.send(mocks).status(200);
          } else {
            res.sendStatus(404);
          }
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
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
        try {
          const { port } = req.params;
          const mock = req.body;

          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            const { id } = await sniffer.getMockManager().addMock(mock);
            res.send(id).status(201);
          } else {
            res.sendStatus(404);
          }
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
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
        try {
          const { port } = req.params;
          const { mockId } = req.body;

          const sniffer = this.snifferManager.getSniffer(+port);
          if (sniffer !== undefined) {
            await sniffer.getMockManager().removeMock(mockId);

            res.sendStatus(200);
          } else {
            res.sendStatus(404);
          }
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
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
        try {
          const { port } = req.params;
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            await sniffer.getMockManager().deactivateManager();

            res.status(200);
          } else {
            res.sendStatus(404);
          }
          res.sendStatus(200);
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
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
        try {
          const { port } = req.params;
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            await sniffer.getMockManager().deactivateManager();

            res.status(200);
          } else {
            res.sendStatus(404);
          }
          res.sendStatus(200);
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
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
        try {
          const { port } = req.params;
          const { mockId } = req.body;
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            await sniffer.getMockManager().activateMock(mockId);

            res.status(200);
          } else {
            res.sendStatus(404);
          }
          res.sendStatus(200);
        } catch (e) {
          if (e instanceof MockNotFoundError) {
            res.sendStatus(404);
          } else {
            console.error(e);
            res.sendStatus(500);
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
        try {
          const { port } = req.params;
          const { mockId } = req.body;
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            await sniffer.getMockManager().deactivateMock(mockId);

            res.status(200);
          } else {
            res.sendStatus(404);
          }
          res.sendStatus(200);
        } catch (e) {
          console.error(e);
          res.sendStatus(500);
        }
      }
    );
  }
}
