import { RequestService } from "../request/request.service";
import { Test } from "../../model/testSuite/test.model";
import { TestResultAnalyzer } from "./test-result-analyzer.service";

export class TestExecutor {
  private readonly testAnalyzer: TestResultAnalyzer;
  constructor(private readonly requestService: RequestService) {
    this.testAnalyzer = new TestResultAnalyzer();
  }

  async execute(test: Test, subdomain: string, testExecutionId: string) {
    // inject test execution id
    const headers = {
      ...test.headers,
      "x-sharkio-test-execution-id": testExecutionId,
    };

    const response = await this.requestService.execute({
      method: test.method,
      url: test.url,
      headers: headers,
      body: test.body,
      subdomain: subdomain,
    });
    return await this.testAnalyzer.analyze(response, test.rules);
  }
}
