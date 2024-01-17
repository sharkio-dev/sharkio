import { NextFunction, Request, Response, Router } from "express";
import { Rule } from "../model/repositories/testSuite/types";
import { RequestService } from "../services/request/request.service";
import { SnifferService } from "../services/sniffer/sniffer.service";
import { useLog } from "../lib/log";
import { TestExecutionService } from "../services/testSuite/testExecution.service";
import { TestExecutor } from "../services/testSuite/test-executor.service";
import { TestSuiteService } from "../services/testSuite/testSuite.service";
import EndpointService from "../services/endpoint/endpoint.service";
import { TestService } from "../services/testSuite/test.service";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class TestSuiteController {
  private readonly testExecutor: TestExecutor;
  constructor(
    private readonly testSuiteService: TestSuiteService,
    private readonly endpointService: EndpointService,
    private readonly testService: TestService,
    private readonly requestService: RequestService,
    private readonly snifferService: SnifferService,
    private readonly testExecutionService: TestExecutionService,
  ) {
    this.testExecutor = new TestExecutor(this.requestService);
  }

  getRouter() {
    const router = Router();
    const catchAsync =
      (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
          log.error(err);
          next(err);
        });
      };

    router.get(
      "",
      /**
       * @openapi
       * /sharkio/test-suites/:
       *   get:
       *     tags:
       *      - TestSuite
       *     description:
       *     responses:
       *       200:
       *         description:  OK
       *       500:
       *         description: Error
       */
      catchAsync(async (req: Request, res: Response) => {
        const userId = res.locals.auth.user.id;
        const testSuites = await this.testSuiteService.getByUserId(userId);
        res.json(testSuites);
      }),
    );

    router.post(
      "",
      /**
       * @openapi
       * /sharkio/test-suites/:
       *   post:
       *     tags:
       *      - TestSuite
       *     description:
       *     responses:
       *       200:
       *         description:  OK
       *       500:
       *         description: Error
       */
      catchAsync(async (req: Request, res: Response) => {
        const userId = res.locals.auth.user.id;
        const { name } = req.body;
        const testSuite = await this.testSuiteService.create(name, userId);
        res.status(201).json(testSuite);
      }),
    );

    router.post(
      "/:testSuiteId/import/:invocationId",
      /**
       * @openapi
       * /sharkio/test-suites/{testSuiteId}/import/{invocationId}:
       *   post:
       *     tags:
       *      - TestSuite
       *     description:
       *     responses:
       *       200:
       *         description:  OK
       *       500:
       *         description: Error
       */
      catchAsync(async (req: Request, res: Response) => {
        try {
          const userId = res.locals.auth.user.id;
          const { name } = req.body;
          const { invocationId, testSuiteId } = req.params;
          const invocation = await this.endpointService.getInvocationById(
            invocationId,
            userId,
          );

          if (!invocation) {
            return res.status(404).send();
          }

          const headerRules: Rule[] = Object.entries(
            // @ts-ignore
            invocation?.response?.headers || {},
          ).map(([key, value]) => ({
            type: "header",
            comparator: "equals",
            expectedValue: value,
            targetPath: key,
          }));

          const test = await this.testService.create(
            name,
            testSuiteId,
            invocation.snifferId,
            invocation.url,
            invocation.body,
            invocation.headers,
            invocation.method,
            [
              {
                type: "status_code",
                comparator: "equals",
                expectedValue: invocation?.response?.status || 200,
                targetPath: "",
              },
              {
                type: "body",
                comparator: "equals",
                expectedValue: invocation?.response?.body || "",
                targetPath: "",
              },
              ...headerRules,
            ],
          );
          res.status(201).json(test);
        } catch (error) {
          res.status(500).send();
        }
      }),
    );

    router.delete(
      "/:testSuiteId/tests/:testId",
      /**
       * @openapi
       * /sharkio/test-suites/{testSuiteId}/tests/{testId}:
       *   delete:
       *     tags:
       *      - TestSuite
       *     description:
       *     responses:
       *       200:
       *         description:  OK
       *       500:
       *         description: Error
       */
      catchAsync(async (req: Request, res: Response) => {
        try {
          const { testSuiteId, testId } = req.params;
          const testSuite = await this.testService.getByTestSuiteId(
            testSuiteId,
          );
          if (!testSuite) {
            return res.status(404).send();
          }

          await this.testExecutionService.deleteByTestId(testId);

          const test = await this.testService.getById(testId);
          if (!test) {
            return res.status(404).send();
          }
          await this.testService.deleteById(testId);
          res.status(204).send();
        } catch (e) {
          log.error(e);
          res.status(500).send();
        }
      }),
    );

    router.get(
      "/:testSuiteId/tests/:testId",
      /**
       * @openapi
       * /sharkio/test-suites/{testSuiteId}/tests/{testId}:
       *   get:
       *     tags:
       *      - TestSuite
       *     description:
       *     responses:
       *       200:
       *         description:  OK
       *       500:
       *         description: Error
       */
      catchAsync(async (req: Request, res: Response) => {
        const { testSuiteId, testId } = req.params;
        const testSuite = await this.testService.getByTestSuiteId(testSuiteId);
        if (!testSuite) {
          return res.status(404).send();
        }
        const test = await this.testService.getById(testId);
        if (!test) {
          return res.status(404).send();
        }
        res.json(test);
      }),
    );

    router.get(
      "/:testSuiteId/tests",
      /**
       * @openapi
       * /sharkio/test-suites/{testSuiteId}/tests:
       *   get:
       *     tags:
       *      - TestSuite
       *     description:
       *     responses:
       *       200:
       *         description:  OK
       *       500:
       *         description: Error
       */
      catchAsync(async (req: Request, res: Response) => {
        const { testSuiteId } = req.params;
        const testSuite = await this.testService.getByTestSuiteId(testSuiteId);
        if (!testSuite) {
          return res.status(404).send();
        }
        res.json(testSuite);
      }),
    );

    router.put(
      "/:testSuiteId",
      /**
       * @openapi
       * /sharkio/test-suites/{testSuiteId}:
       *   put:
       *     tags:
       *      - TestSuite
       *     description:
       *     responses:
       *       200:
       *         description:  OK
       *       500:
       *         description: Error
       */
      catchAsync(async (req: Request, res: Response) => {
        const { testSuiteId } = req.params;
        const testSuite = await this.testSuiteService.getById(testSuiteId);
        if (!testSuite) {
          return res.status(404).send();
        }
        const { name } = req.body;
        await this.testSuiteService.update(testSuiteId, name);
        res.status(204).send();
      }),
    );

    router.delete(
      "/:testSuiteId",
      /**
       * @openapi
       * /sharkio/test-suites/{testSuiteId}:
       *   delete:
       *     tags:
       *      - TestSuite
       *     description:
       *     responses:
       *       200:
       *         description:  OK
       *       500:
       *         description: Error
       */
      catchAsync(async (req: Request, res: Response) => {
        const { testSuiteId } = req.params;
        const testSuite = await this.testSuiteService.getById(testSuiteId);
        if (!testSuite) {
          return res.status(404).send();
        }
        await this.testSuiteService.deleteById(testSuiteId);
        res.status(204).send();
      }),
    );

    router.put(
      "/:testSuiteId/tests/:testId",
      /**
       * @openapi
       * /sharkio/test-suites/{testSuiteId}/tests/{testId}:
       *   put:
       *     tags:
       *      - TestSuite
       *     description:
       *     responses:
       *       200:
       *         description:  OK
       *       500:
       *         description: Error
       */
      catchAsync(async (req: Request, res: Response) => {
        const { testSuiteId, testId } = req.params;
        const { headers, body, url, method } = req.body;
        const testSuite = await this.testService.getByTestSuiteId(testSuiteId);
        if (!testSuite) {
          return res.status(404).send();
        }
        const test = await this.testService.getById(testId);
        if (!test) {
          return res.status(404).send();
        }
        const { name, rules } = req.body;
        await this.testService.updateById(testId, {
          name,
          rules,
          headers: headers as any,
          body: body as any,
          url,
          method,
        });
        res.status(204).send();
      }),
    );

    router.post(
      "/:testSuiteId/tests/:testId/run",
      /**
       * @openapi
       * /sharkio/test-suites/{testSuiteId}/tests/{testId}/run:
       *   post:
       *     tags:
       *      - TestSuite
       *     description:
       *     responses:
       *       200:
       *         description:  OK
       *       500:
       *         description: Error
       */
      catchAsync(async (req: Request, res: Response) => {
        try {
          const { testSuiteId, testId } = req.params;
          const userId = res.locals.auth.user.id;

          const testSuite = await this.testService.getByTestSuiteId(
            testSuiteId,
          );
          if (!testSuite) {
            return res.status(404).send();
          }

          const test = await this.testService.getById(testId);
          if (!test) {
            return res.status(404).send();
          }

          const sniffer = await this.snifferService.getSniffer(
            userId,
            test.snifferId,
          );
          if (!sniffer) {
            return res.status(404).send();
          }

          const testExecution = await this.testExecutionService.create(testId);

          const results = await this.testExecutor.execute(
            test,
            sniffer.subdomain,
            testExecution.id,
          );

          await this.testExecutionService.update(testExecution.id, results);

          return res.status(204).send(results);
        } catch (e) {
          log.error(e);
          res.status(500).send();
        }
      }),
    );

    router.get(
      "/:testSuiteId/test-executions",
      /**
       * @openapi
       * /sharkio/test-suites/{testSuiteId}/test-executions:
       *   get:
       *     tags:
       *      - TestSuite
       *     description:
       *     responses:
       *       200:
       *         description:  OK
       *       500:
       *         description: Error
       */
      catchAsync(async (req: Request, res: Response) => {
        const { testSuiteId } = req.params;
        const { url } = req.query;
        const tests =
          (await this.testService.getByUrl(testSuiteId, url as string)) || [];

        const testExecutions = await this.testExecutionService.getByTestId(
          tests.map((test) => test.id),
        );

        if (!testExecutions) {
          return res.status(404).send();
        }

        let results: any = [];
        for (const testExecution of testExecutions) {
          const result: any = {};
          if (
            !testExecution.request[0] ||
            !testExecution.request[0].responses[0]
          ) {
            continue;
          }
          result["request"] = testExecution.request[0];
          result["response"] = testExecution.request[0].responses[0];
          result["testExecution"] = { ...testExecution, test: undefined };
          result["test"] = testExecution.test;
          result["checks"] = testExecution.checks || [];

          results.push(result);
        }

        res.json(results);
      }),
    );

    router.get(
      "/:testSuiteId/tests/:testId/test-executions",
      /**
       * @openapi
       * /sharkio/test-suites/tests/{testId}/test-executions:
       *   get:
       *     tags:
       *      - TestSuite
       *     description:
       *     responses:
       *       200:
       *         description:  OK
       *       500:
       *         description: Error
       */
      catchAsync(async (req: Request, res: Response) => {
        const { testSuiteId, testId } = req.params;
        const testSuite = await this.testService.getByTestSuiteId(testSuiteId);
        if (!testSuite) {
          return res.status(404).send();
        }

        const test = await this.testService.getById(testId);
        if (!test) {
          return res.status(404).send();
        }

        const testExecutions = await this.testExecutionService.getByTestId([
          testId,
        ]);

        if (!testExecutions) {
          return res.status(404).send();
        }

        let results: any = [];
        for (const testExecution of testExecutions) {
          if (
            !testExecution.request[0] ||
            !testExecution.request[0].responses[0]
          ) {
            continue;
          }
          const result: any = {};
          result["request"] = testExecution.request[0];
          if (testExecution.request[0].responses != null) {
            result["response"] = testExecution.request[0].responses[0];
          }
          result["testExecution"] = { ...testExecution, test: undefined };
          result["test"] = test;
          result["checks"] = testExecution.checks || [];

          results.push(result);
        }

        res.json(results);
      }),
    );

    return { path: "/sharkio/test-suites", router };
  }
}
