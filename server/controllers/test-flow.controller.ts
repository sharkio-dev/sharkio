import { Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import { useLog } from "../lib/log";
import { TestFlowService } from "../services/test-flow/test-flow.service";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class TestFlowController {
  constructor(
    private readonly testFlowService: TestFlowService,
    private readonly baseUrl: string = "/sharkio/test-flows",
  ) {}

  getRouter() {
    const router = PromiseRouter();

    router
      .post(
        "/",
        /**
         * @openapi
         * /sharkio/test-flows:
         *   post:
         *     tags:
         *      - TestFlow
         *     description: Create test flow
         *     requestBody:
         *       description: Create a test flow
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - name
         *             properties:
         *               name:
         *                 type: string
         *                 description: The name of the sniffer
         *                 example: My sniffer
         *     responses:
         *       201:
         *         description: Test flow created
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response) => {
          const ownerId = res.locals.auth.ownerId;
          const created = await this.testFlowService.createFlow({
            ownerId,
            ...req.body,
          });
          res.send(created).status(201);
        },
      )
      .get(
        "/",
        /**
         * @openapi
         * /sharkio/test-flows:
         *   get:
         *     tags:
         *      - TestFlow
         *     description: Get all test flows
         *     responses:
         *       200:
         *         description: Gets all test flows
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response) => {
          const ownerId = res.locals.auth.ownerId;
          const testFlows = await this.testFlowService.getByOwnerId(ownerId);
          res.send(testFlows).status(200);
        },
      );

    router
      .get(
        "/:flowId",
        /**
         * @openapi
         * /sharkio/test-flows/{flowId}:
         *   get:
         *     tags:
         *      - TestFlow
         *     description: Get a test flow
         *     parameters:
         *       - name: flowId
         *         in: path
         *         schema:
         *           type: string
         *         description: flowId
         *         required: true
         *     responses:
         *       200:
         *         description: Gets a test flow
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response) => {
          const ownerId = res.locals.auth.ownerId;
          const { flowId } = req.params;
          const testFlow = await this.testFlowService.getById(ownerId, flowId);
          res.send(testFlow).status(200);
        },
      )
      .delete(
        "/:flowId",
        /**
         * @openapi
         * /sharkio/test-flows/{flowId}:
         *   delete:
         *     tags:
         *      - TestFlow
         *     description: Delete a test flow
         *     parameters:
         *       - name: flowId
         *         in: path
         *         schema:
         *           type: string
         *         description: flowId
         *         required: true
         *     responses:
         *       200:
         *         description: Delete a test flow
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response) => {
          const ownerId = res.locals.auth.ownerId;
          const { flowId } = req.params;
          const testFlow = await this.testFlowService.deleteById(
            ownerId,
            flowId,
          );
          res.send(testFlow).status(200);
        },
      )
      .put(
        "/:flowId",
        /**
         * @openapi
         * /sharkio/test-flows/{flowId}:
         *   put:
         *     tags:
         *      - TestFlow
         *     description: Update a test flow
         *     parameters:
         *       - name: flowId
         *         in: path
         *         schema:
         *           type: string
         *         description: flowId
         *         required: true
         *     requestBody:
         *       description: Update a test flow
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required:
         *               - name
         *             properties:
         *               name:
         *                 type: string
         *                 description: The name of the sniffer
         *                 example: My sniffer
         *     responses:
         *       200:
         *         description: Gets a test flow
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response) => {
          const ownerId = res.locals.auth.ownerId;
          const { name } = req.body;
          const { flowId } = req.params;

          const testFlow = await this.testFlowService.updateById(
            ownerId,
            flowId,
            { name },
          );

          res.send(testFlow).status(200);
        },
      );

    return {
      router,
      path: this.baseUrl,
    };
  }
}
