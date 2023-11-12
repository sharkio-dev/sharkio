import EndpointService from "../services/endpoint/endpoint.service";
import { TestSuiteService } from "../services/testSuite/testSuite.service";
import { TestService } from "../services/testSuite/test.service";
import { Router } from "express";
import { Rule } from "../model/testSuite/types";
export class TestSuiteController {
  constructor(
    private readonly testSuiteService: TestSuiteService,
    private readonly endpointService: EndpointService,
    private readonly testService: TestService
  ) {}

  getRouter() {
    const router = Router();

    router.get("", async (req, res) => {
      const userId = res.locals.auth.user.id;
      const testSuites = await this.testSuiteService.getByUserId(userId);
      res.json(testSuites);
    });

    router.post("", async (req, res) => {
      const userId = res.locals.auth.user.id;
      const { name } = req.body;
      const testSuite = await this.testSuiteService.create(name, userId);
      res.status(201).json(testSuite);
    });

    router.post("/:testSuiteId/import/:invocationId", async (req, res) => {
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
          invocation.url,
          invocation.body,
          invocation.headers,
          invocation.method,
          [
            {
              type: "status_code",
              comparator: "equals",
              // @ts-ignore
              value: invocation?.response?.status || 200,
            },
            {
              type: "body",
              comparator: "equals",
              // @ts-ignore
              value: invocation?.response?.body || "",
            },
            ...headerRules,
          ]
        );
        res.status(201).json(test);
      } catch (error) {
        console.log(error);
        res.status(500).send();
      }
    });

    router.get("/:testSuiteId/tests", async (req, res) => {
      const { testSuiteId } = req.params;
      const testSuite = await this.testService.getTestSuiteId(testSuiteId);
      if (!testSuite) {
        return res.status(404).send();
      }
      res.json(testSuite);
    });

    return { path: "/sharkio/test-suites", router };
  }
}
