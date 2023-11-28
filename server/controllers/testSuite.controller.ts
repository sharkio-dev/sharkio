import EndpointService from "../services/endpoint/endpoint.service";
import { TestSuiteService } from "../services/testSuite/testSuite.service";
import { TestService } from "../services/testSuite/test.service";
import { NextFunction, Request, Response, Router } from "express";
import { Rule } from "../model/testSuite/types";
import { RequestService } from "../services/request/request.service";
import { SnifferService } from "../services/sniffer/sniffer.service";
import { useLog } from "../lib/log";
import { TestExecutionService } from "../services/testSuite/testExecution.service";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class TestSuiteController {
  constructor(
    private readonly testSuiteService: TestSuiteService,
    private readonly endpointService: EndpointService,
    private readonly testService: TestService,
    private readonly requestService: RequestService,
    private readonly snifferService: SnifferService,
    private readonly testExecutionService: TestExecutionService,
  ) {}

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
      catchAsync(async (req: Request, res: Response) => {
        const userId = res.locals.auth.user.id;
        const testSuites = await this.testSuiteService.getByUserId(userId);
        res.json(testSuites);
      }),
    );

    router.post(
      "",
      catchAsync(async (req: Request, res: Response) => {
        const userId = res.locals.auth.user.id;
        const { name } = req.body;
        const testSuite = await this.testSuiteService.create(name, userId);
        res.status(201).json(testSuite);
      }),
    );

    router.post(
      "/:testSuiteId/import/:invocationId",
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
      catchAsync(async (req: Request, res: Response) => {
        try {
          const { testSuiteId, testId } = req.params;
          const testSuite =
            await this.testService.getByTestSuiteId(testSuiteId);
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
      catchAsync(async (req: Request, res: Response) => {
        try {
          const { testSuiteId, testId } = req.params;
          const userId = res.locals.auth.user.id;

          const testSuite =
            await this.testService.getByTestSuiteId(testSuiteId);
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

          const headers = {
            ...test.headers,
            "x-sharkio-test-execution-id": testExecution.id,
          };

          await this.requestService.execute({
            method: test.method,
            url: test.url,
            headers: headers,
            body: test.body,
            subdomain: sniffer.subdomain,
          });
          const request = await this.requestService.getByTestExecutionId(
            testExecution.id,
          );
          const response = request?.response[0];

          const checks = test.rules.map((rule) => {
            const { type, comparator, expectedValue, targetPath } = rule;
            if (type === "status_code") {
              return {
                type,
                comparator,
                expectedValue,
                targetPath,
                actualValue: response?.status,
                isPassed:
                  response?.status.toString() === expectedValue.toString(),
              };
            }
            if (type === "body") {
              return {
                type,
                comparator,
                expectedValue,
                targetPath,
                actualValue: response?.body,
                isPassed: response?.body === expectedValue,
              };
            }

            if (type === "header") {
              return {
                type,
                comparator,
                expectedValue,
                targetPath,
                actualValue: response?.headers[targetPath],
                isPassed: response?.headers[targetPath] === expectedValue,
              };
            }
          });
          await this.testExecutionService.update(testExecution.id, checks);

          res.status(204).send();
        } catch (e) {
          log.error(e);
          res.status(500).send();
        }
      }),
    );

    router.get(
      "/:testSuiteId/test-executions",
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
            !testExecution.request[0].response[0]
          ) {
            continue;
          }
          result["request"] = testExecution.request[0];
          result["response"] = testExecution.request[0].response[0];
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
            !testExecution.request[0].response[0]
          ) {
            continue;
          }
          const result: any = {};
          result["request"] = testExecution.request[0];
          if (testExecution.request[0].response != null) {
            result["response"] = testExecution.request[0].response[0];
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
