import z from "zod";
import { Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import { useLog } from "../lib/log";
import { TestFlowService } from "../services/test-flow/test-flow.service";
import { requestValidator } from "../lib/request-validator";
import {
  CreateTestFlowValidator,
  CreateTestNodeValidator,
} from "../dto/in/test-flow.dto";

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
        requestValidator({ body: CreateTestFlowValidator }),
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
        requestValidator({ body: CreateTestFlowValidator }),
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

    router
      .get(
        "/:flowId/nodes",
        /**
         * @openapi
         *  /sharkio/test-flows/{flowId}/nodes:
         *    get:
         *      tags:
         *        - TestNode
         *      parameters:
         *        - name: flowId
         *          in: path
         *          schema:
         *            type: string
         *            format: uuid
         *          description: flowId
         *          required: true
         *      responses:
         *        '200':
         *          description: Created
         *        '400':
         *          description: Bad Request
         *        '500':
         *          description: Server Error
         */
        async (req: Request, res: Response) => {
          const ownerId = res.locals.auth.ownerId;
          const { flowId } = req.params;

          const testNodes = await this.testFlowService.getNodesByFlowId(
            ownerId,
            flowId,
          );

          res.send(testNodes).status(200);
        },
      )
      .post(
        "/:flowId/nodes",
        requestValidator({
          body: CreateTestNodeValidator,
          params: z.object({ flowId: z.string().uuid() }),
        }),
        /**
       * @openapi
       *  /sharkio/test-flows/{flowId}/nodes:
       *    post:
       *      operationId: createTestNode
       *      tags:
       *        - TestNode
       *      parameters:
       *        - name: flowId
       *          in: path
       *          schema:
       *            type: string
       *            format: uuid
       *          description: flowId
       *          required: true
       *      requestBody:
       *        required: true
       *        content:
       *          application/json:
       *            schema:
       *              type: object
       *              required:
       *                - name
       *                - proxyId
       *                - request
       *                - assertions
       *              properties:
       *                name:
       *                  type: string
       *                  description: The name of the test node
       *                proxyId:
       *                  type: string
       *                  format: uuid
       *                  description: The proxy ID associated with the test node
       *                assertions:
       *                  type: array
       *                  items:
       *                    type: object
       *                    properties:
       *                      path:
       *                        type: string
       *                        example: body.example
       *                      comparator:
       *                        type: string
       *                        example: eq
       *                      expectedValue:
       *                        type: string
       *                        example: example
       *                request:
       *                  schema:
       *                  type: object
       *                  properties:
       *                    url:
       *                      type: string
       *                    method:
       *                      type: string
       *                    headers:
       *                      type: object
       *                    body:
       *                      type: string
       *                    requestId:
       *                      type: string
       *                      format: uuid

       *      responses:
       *        '201':
       *          description: Created
       *        '400':
       *          description: Bad Request
       *        '500':
       *          description: Server Error
       */
        async (req: Request, res: Response) => {
          const ownerId = res.locals.auth.ownerId;
          const { flowId } = req.params;
          const testFlowNode = req.body;

          const testNode = await this.testFlowService.createNode(
            ownerId,
            flowId,
            testFlowNode,
          );

          res.send(testNode).status(201);
        },
      );

    return {
      router,
      path: this.baseUrl,
    };
  }
}
