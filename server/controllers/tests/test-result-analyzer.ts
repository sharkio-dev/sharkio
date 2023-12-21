import { Rule } from "../../model/testSuite/types";

export class TestResultAnalyzer {
  private readonly bodyAnalyzer: TestBodyAnalyzer;
  private readonly headerAnalyzer: TestHeaderAnalyzer;
  private readonly statusAnalyzer: TestStatusAnalyzer;

  constructor() {
    this.bodyAnalyzer = new TestBodyAnalyzer();
    this.headerAnalyzer = new TestHeaderAnalyzer();
    this.statusAnalyzer = new TestStatusAnalyzer();
  }

  async analyze(response: any, rules: Rule[]) {
    const results: any = [];
    for (const rule of rules) {
      let isPassed = false;
      switch (rule.type) {
        case "status_code":
          isPassed = await this.statusAnalyzer.analyze(response.status, rule);
          results.push({
            ...rule,
            isPassed,
            actualValue: response.status,
          });
          break;
        case "header":
          isPassed = await this.headerAnalyzer.analyze(response.headers, rule);
          results.push({
            ...rule,
            isPassed,
            actualValue: response.headers[rule.targetPath],
          });
          break;
        case "body":
          isPassed = await this.bodyAnalyzer.analyze(response.data, rule);
          results.push({
            ...rule,
            isPassed,
            actualValue: JSON.stringify(response.data),
          });
          break;
      }
    }
    return results;
  }
}
class TestStatusAnalyzer {
  constructor() {}

  async analyze(status: any, rules: Rule) {
    switch (rules.comparator) {
      case "equals":
        return status.toString() === rules.expectedValue.toString();
    }
  }
}
class TestHeaderAnalyzer {
  constructor() {}

  async analyze(headers: any, rules: Rule) {
    switch (rules.comparator) {
      case "equals":
        return headers[rules.targetPath] === rules.expectedValue;
    }
  }
}
class TestBodyAnalyzer {
  constructor() {}

  async analyze(body: any, rules: Rule) {
    switch (rules.comparator) {
      case "equals":
        try {
          return (
            JSON.stringify(body) ===
            JSON.stringify(JSON.parse(rules.expectedValue))
          );
        } catch (e) {
          return body === rules.expectedValue;
        }
    }
  }
}
