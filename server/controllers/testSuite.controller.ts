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
    private readonly testExecutionService: TestExecutionService
  ) {}

  getRouter() {
    const router = Router();
    const catchAsync =
      (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err));
      };

    router.get(
      "",
      catchAsync(async (req: Request, res: Response) => {
        const userId = res.locals.auth.user.id;
        const testSuites = await this.testSuiteService.getByUserId(userId);
        res.json(testSuites);
      })
    );

    router.post(
      "",
      catchAsync(async (req: Request, res: Response) => {
        const userId = res.locals.auth.user.id;
        const { name } = req.body;
        const testSuite = await this.testSuiteService.create(name, userId);
        res.status(201).json(testSuite);
      })
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
            userId
          );

          if (!invocation) {
            return res.status(404).send();
          }

          const headerRules: Rule[] = Object.entries(
            // @ts-ignore
            invocation?.response?.headers || {}
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
            ]
          );
          res.status(201).json(test);
        } catch (error) {
          console.log(error);
          res.status(500).send();
        }
      })
    );

    router.delete(
      "/:testSuiteId/tests/:testId",
      catchAsync(async (req: Request, res: Response) => {
        try {
          const { testSuiteId, testId } = req.params;
          const testSuite = await this.testService.getByTestSuiteId(
            testSuiteId
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
      })
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
      })
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
      })
    );

    router.put(
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
        const { name, rules } = req.body;
        await this.testService.updateById(testId, {
          name,
          rules,
        });
        res.status(204).send();
      })
    );

    router.post(
      "/:testSuiteId/tests/:testId/run",
      catchAsync(async (req: Request, res: Response) => {
        try {
          const { testSuiteId, testId } = req.params;
          const userId = res.locals.auth.user.id;
          const testSuite = await this.testService.getByTestSuiteId(
            testSuiteId
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
            test.snifferId
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

          res.status(204).send();
        } catch (e) {
          log.error(e);
          res.status(500).send();
        }
      })
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

        const testExecutions = await this.testExecutionService.getByTestId(
          testId
        );
        if (!testExecutions) {
          return res.status(404).send();
        }

        const rules = test.rules;

        let results: any = [];
        for (const testExecution of testExecutions) {
          let result: any = {};
          const request = await this.requestService.getByTestExecutionId(
            testExecution.id
          );
          const response = request?.response[0];
          result["request"] = { ...request };
          result["response"] = { ...response };
          result["testExecution"] = { ...testExecution };

          result["checks"] = rules.map((rule) => {
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
          results.push(result);
        }
        console.log({ results });
        res.json(results);
      })
    );

    return { path: "/sharkio/test-suites", router };
  }
}
