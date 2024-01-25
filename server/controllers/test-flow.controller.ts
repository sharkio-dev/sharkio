import { CreateTestFlowValidator } from "../dto/in/create-test-flow.dto";
import { useLog } from "../lib/log";
import { TestFlowService } from "../services/test-flow/test-flow.service";
import { Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import { requestValidator } from "../lib/request-validator/request-validator";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class TestFlowController {
  constructor(
    private readonly testFlowService: TestFlowService,
    private readonly baseUrl: string = "/sharkio/test-flow",
  ) {}

  getRouter() {
    const router = PromiseRouter();
    /**
     * @openapi
     * /sharkio/test-flow:
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
    router.post(
      "/",
      //   requestValidator({ body: CreateTestFlowValidator }),
      async (req: Request, res: Response) => {
        const ownerId = res.locals.auth.ownerId;
        const created = await this.testFlowService.createFlow(req.body);
        res.send(created).status(201);
      },
    );

    return {
      router,
      path: this.baseUrl,
    };
  }
}
