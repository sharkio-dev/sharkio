import { Rule } from "../../model/repositories/testSuite/types";
import _ from "lodash";

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
            actualValue:
              typeof response.data === "object"
                ? JSON.stringify(response.data)
                : response.data,
          });
          break;
      }
    }
    return results;
  }
}
class TestStatusAnalyzer {
  constructor() {}

  async analyze(status: any, rule: Rule) {
    try {
      switch (rule.comparator) {
        case "equals":
          return this.isEquals(status, rule.expectedValue);
        case "not_equals":
          return !this.isEquals(status, rule.expectedValue);
        case "gt":
          return this.isGreaterThan(status, rule.expectedValue);
        case "lt":
          return (
            !this.isGreaterThan(status, rule.expectedValue) &&
            !this.isEquals(status, rule.expectedValue)
          );
        case "gte":
          return (
            this.isGreaterThan(status, rule.expectedValue) ||
            this.isEquals(status, rule.expectedValue)
          );
        case "lte":
          return (
            !this.isGreaterThan(status, rule.expectedValue) ||
            this.isEquals(status, rule.expectedValue)
          );
        default:
          throw Error("Comparator not found");
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  isEquals(status: any, expectedValue: any) {
    return status.toString() === expectedValue.toString();
  }
  isGreaterThan(status: string, expectedValue: string) {
    return parseInt(status.toString()) > parseInt(expectedValue.toString());
  }
}
class TestHeaderAnalyzer {
  constructor() {}

  async analyze(headers: any, rules: Rule) {
    switch (rules.comparator) {
      case "equals":
        return this.isEquals(headers, rules.targetPath, rules.expectedValue);
      case "not_equals":
        return !this.isEquals(headers, rules.targetPath, rules.expectedValue);
      case "contains":
        return this.isContains(headers, rules.targetPath, rules.expectedValue);
      case "not_contains":
        return !this.isContains(headers, rules.targetPath, rules.expectedValue);
      case "gt":
        return this.isGreaterThan(
          headers,
          rules.targetPath,
          rules.expectedValue
        );
      case "lt":
        return (
          !this.isGreaterThan(headers, rules.targetPath, rules.expectedValue) &&
          !this.isEquals(headers, rules.targetPath, rules.expectedValue)
        );
      case "gte":
        return (
          this.isGreaterThan(headers, rules.targetPath, rules.expectedValue) ||
          this.isEquals(headers, rules.targetPath, rules.expectedValue)
        );
      case "lte":
        return (
          !this.isGreaterThan(headers, rules.targetPath, rules.expectedValue) ||
          this.isEquals(headers, rules.targetPath, rules.expectedValue)
        );
      default:
        throw Error("Comparator not found");
    }
  }

  isEquals(headers: any, targetPath: string, expectedValue: any) {
    return headers[targetPath] === expectedValue;
  }

  isContains(headers: any, targetPath: string, expectedValue: any) {
    return headers[targetPath].includes(expectedValue);
  }

  isGreaterThan(headers: any, targetPath: string, expectedValue: any) {
    return (
      parseInt(headers[targetPath].toString()) >
      parseInt(expectedValue.toString())
    );
  }
}

class TestBodyAnalyzer {
  constructor() {}

  async analyze(body: any, rules: Rule) {
    switch (rules.comparator) {
      case "equals":
        return this.isEquals(body, rules.expectedValue);
      case "not_equals":
        return !this.isEquals(body, rules.expectedValue);
      case "contains":
        return this.isContains(body, rules.expectedValue);
      case "not_contains":
        return !this.isContains(body, rules.expectedValue);
      case "gt":
        return this.isGreaterThan(body, rules.expectedValue);
      case "lt":
        return (
          !this.isGreaterThan(body, rules.expectedValue) &&
          !this.isEquals(body, rules.expectedValue)
        );
      case "gte":
        return (
          this.isGreaterThan(body, rules.expectedValue) ||
          this.isEquals(body, rules.expectedValue)
        );
      case "lte":
        return (
          !this.isGreaterThan(body, rules.expectedValue) ||
          this.isEquals(body, rules.expectedValue)
        );
      default:
        throw Error("Comparator not found");
    }
  }

  isEquals(body: any, expectedValue: any) {
    try {
      // if body is object
      return _.isEqual(JSON.parse(body), JSON.parse(expectedValue));
    } catch (e) {
      // if body is object but expectedValue is string or both are string.
      return JSON.stringify(body) === expectedValue || body === expectedValue;
    }
  }

  isGreaterThan(body: any, expectedValue: any) {
    return parseInt(body) > parseInt(expectedValue);
  }

  isContains(body: any, expectedValue: any) {
    try {
      return body.includes(expectedValue);
    } catch (e) {
      return false;
    }
  }
}
