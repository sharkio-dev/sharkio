import { TestSuiteService } from "../services/testSuite/testSuite.service";
import { Router } from "express";
export class TestSuiteController {
  constructor(private readonly testSuiteService: TestSuiteService) {}

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

    return { path: "/sharkio/test-suites", router };
  }
}
