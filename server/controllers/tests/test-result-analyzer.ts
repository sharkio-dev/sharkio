const _ = require("lodash");

type RuleType = "status_code" | "body" | "header";
type RuleComparator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "gt"
  | "lt"
  | "gte"
  | "lte";
type Rule = {
  type: RuleType;
  comparator: RuleComparator;
  targetPath: string;
  expectedValue: any;
};

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

  async analyze(status: any, rules: Rule) {
    try {
      switch (rules.comparator) {
        case "equals":
          return this.isEquals(status, rules.expectedValue);
        case "not_equals":
          return !this.isEquals(status, rules.expectedValue);
        case "gt":
          return this.isGreaterThan(status, rules.expectedValue);
        case "lt":
          return (
            !this.isGreaterThan(status, rules.expectedValue) &&
            !this.isEquals(status, rules.expectedValue)
          );
        case "gte":
          return (
            this.isGreaterThan(status, rules.expectedValue) ||
            this.isEquals(status, rules.expectedValue)
          );
        case "lte":
          return (
            !this.isGreaterThan(status, rules.expectedValue) ||
            this.isEquals(status, rules.expectedValue)
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

const statusTests: Rule[] = [
  {
    type: "status_code",
    comparator: "equals",
    targetPath: "",
    expectedValue: 200,
  },
  {
    type: "status_code",
    comparator: "equals",
    targetPath: "",
    expectedValue: 400,
  },
  {
    type: "status_code",
    comparator: "not_equals",
    targetPath: "",
    expectedValue: 400,
  },
  {
    type: "status_code",
    comparator: "not_equals",
    targetPath: "",
    expectedValue: 200,
  },
  {
    type: "status_code",
    comparator: "gt",
    targetPath: "",
    expectedValue: 100,
  },
  {
    type: "status_code",
    comparator: "gt",
    targetPath: "",
    expectedValue: 400,
  },
  {
    type: "status_code",
    comparator: "lt",
    targetPath: "",
    expectedValue: 400,
  },
  {
    type: "status_code",
    comparator: "lt",
    targetPath: "",
    expectedValue: 200,
  },
  {
    type: "status_code",
    comparator: "gte",
    targetPath: "",
    expectedValue: 200,
  },
  {
    type: "status_code",
    comparator: "gte",
    targetPath: "",
    expectedValue: 400,
  },
  {
    type: "status_code",
    comparator: "lte",
    targetPath: "",
    expectedValue: 400,
  },
  {
    type: "status_code",
    comparator: "lte",
    targetPath: "",
    expectedValue: 100,
  },
];

const headerTests: Rule[] = [
  {
    type: "header",
    targetPath: "content-type",
    comparator: "equals",
    expectedValue: "application/json",
  },
  {
    type: "header",
    targetPath: "content-type",
    comparator: "equals",
    expectedValue: "application/xml",
  },
  {
    type: "header",
    targetPath: "content-type",
    comparator: "not_equals",
    expectedValue: "application/xml",
  },
  {
    type: "header",
    targetPath: "content-type",
    comparator: "not_equals",
    expectedValue: "application/json",
  },
  {
    type: "header",
    targetPath: "content-type",
    comparator: "contains",
    expectedValue: "json",
  },
  {
    type: "header",
    targetPath: "content-type",
    comparator: "contains",
    expectedValue: "xml",
  },
  {
    type: "header",
    targetPath: "content-type",
    comparator: "not_contains",
    expectedValue: "xml",
  },
  {
    type: "header",
    targetPath: "content-type",
    comparator: "not_contains",
    expectedValue: "json",
  },
  {
    type: "header",
    targetPath: "content-length",
    comparator: "gt",
    expectedValue: "90",
  },
  {
    type: "header",
    targetPath: "content-length",
    comparator: "gt",
    expectedValue: "1000",
  },
  {
    type: "header",
    targetPath: "content-length",
    comparator: "lt",
    expectedValue: "1000",
  },
  {
    type: "header",
    targetPath: "content-length",
    comparator: "lt",
    expectedValue: "100",
  },
  {
    type: "header",
    targetPath: "content-length",
    comparator: "gte",
    expectedValue: "100",
  },
  {
    type: "header",
    targetPath: "content-length",
    comparator: "gte",
    expectedValue: "1000",
  },
  {
    type: "header",
    targetPath: "content-length",
    comparator: "lte",
    expectedValue: "1000",
  },
  {
    type: "header",
    targetPath: "content-length",
    comparator: "lte",
    expectedValue: "90",
  },
];

const bodyTests: Rule[] = [
  {
    type: "body",
    targetPath: '{"name":"test"}',
    comparator: "equals",
    expectedValue: '{"name":"test"}',
  },
  {
    type: "body",
    targetPath: "name",
    comparator: "equals",
    expectedValue: "test",
  },
  {
    type: "body",
    targetPath: "",
    comparator: "not_equals",
    expectedValue: "test",
  },
  {
    type: "body",
    targetPath: "name",
    comparator: "not_equals",
    expectedValue: '{"name":"test"}',
  },
  {
    type: "body",
    targetPath: "name",
    comparator: "contains",
    expectedValue: "test",
  },
  {
    type: "body",
    targetPath: "name",
    comparator: "contains",
    expectedValue: "test1",
  },
  {
    type: "body",
    targetPath: "name",
    comparator: "not_contains",
    expectedValue: "test1",
  },
  {
    type: "body",
    targetPath: "name",
    comparator: "not_contains",
    expectedValue: "test",
  },
  {
    type: "body",
    targetPath: "name",
    comparator: "gt",
    expectedValue: "0",
  },
  {
    type: "body",
    targetPath: "name",
    comparator: "gt",
    expectedValue: "200",
  },
  {
    type: "body",
    targetPath: "name",
    comparator: "lt",
    expectedValue: "200",
  },
  {
    type: "body",
    targetPath: "name",
    comparator: "lt",
    expectedValue: "0",
  },
  {
    type: "body",
    targetPath: "name",
    comparator: "gte",
    expectedValue: "100",
  },
  {
    type: "body",
    targetPath: "name",
    comparator: "gte",
    expectedValue: "300",
  },
  {
    type: "body",
    targetPath: "name",
    comparator: "lte",
    expectedValue: "100",
  },
  {
    type: "body",
    targetPath: "name",
    comparator: "lte",
    expectedValue: "0",
  },
];

const inputList = [
  {
    response: {
      status: 200,
      headers: {
        "content-type": "application/json",
        "content-length": "100",
      },
      data: {
        name: "test",
      },
    },
    rules: [...statusTests, ...headerTests, ...bodyTests.slice(0, 4)],
  },
  {
    response: {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
      data: `{
      "name": "test"
    }`,
    },
    rules: [...bodyTests.slice(0, 8)],
  },
  {
    response: {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
      data: 100,
    },
    rules: [...bodyTests.slice(8, 16)],
  },
  {
    response: {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
      data: "100",
    },
    rules: [...bodyTests.slice(8, 16)],
  },
];

const run = async () => {
  const testResultAnalyzer = new TestResultAnalyzer();
  let j = 0;
  for (const { response, rules } of inputList) {
    let result: boolean[] = [];
    console.log(j, rules.length);

    await testResultAnalyzer.analyze(response, rules).then((res) => {
      console.log("====================================");

      res.map(({ isPassed }: { isPassed: boolean }, i: number) => {
        if (i % 2 === 0) {
          result.push(isPassed === true);
        } else {
          result.push(isPassed === false);
        }
      });
      console.log("Test case " + j++ + ": " + result.every((x) => x === true));
      for (let i = 0; i < result.length; i++) {
        console.log("Test " + i + ": " + result[i]);
      }
      console.log("====================================");
    });
  }
};

run();
