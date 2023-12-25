import { TestResultAnalyzer } from "../../services/testSuite/test-result-analyzer.service";

describe("test-result-analyzer", () => {
  let testResultAnalyzer: TestResultAnalyzer;
  beforeAll(() => {
    testResultAnalyzer = new TestResultAnalyzer();
  });

  describe("Analyze Status Code", () => {
    // Array of test cases
    const testCases = [
      {
        description: "Positive status code test",
        response: {
          status: 200,
          headers: {
            "content-type": "application/json",
            "content-length": "100",
          },
          data: { name: "test" },
        },
        rules: [
          {
            type: "status_code",
            comparator: "equals",
            targetPath: "",
            expectedValue: 200,
          },
          {
            type: "status_code",
            comparator: "not_equals",
            targetPath: "",
            expectedValue: 400,
          },
          {
            type: "status_code",
            comparator: "gt",
            targetPath: "",
            expectedValue: 100,
          },
          {
            type: "status_code",
            comparator: "lt",
            targetPath: "",
            expectedValue: 400,
          },
          {
            type: "status_code",
            comparator: "gte",
            targetPath: "",
            expectedValue: 200,
          },
          {
            type: "status_code",
            comparator: "lte",
            targetPath: "",
            expectedValue: 400,
          },
        ],
        expected: [
          {
            type: "status_code",
            comparator: "equals",
            targetPath: "",
            expectedValue: 200,
            actualValue: 200,
            isPassed: true,
          },
          {
            type: "status_code",
            comparator: "not_equals",
            targetPath: "",
            expectedValue: 400,
            actualValue: 200,
            isPassed: true,
          },
          {
            type: "status_code",
            comparator: "gt",
            targetPath: "",
            expectedValue: 100,
            actualValue: 200,
            isPassed: true,
          },
          {
            type: "status_code",
            comparator: "lt",
            targetPath: "",
            expectedValue: 400,
            actualValue: 200,
            isPassed: true,
          },
          {
            type: "status_code",
            comparator: "gte",
            targetPath: "",
            expectedValue: 200,
            actualValue: 200,
            isPassed: true,
          },
          {
            type: "status_code",
            comparator: "lte",
            targetPath: "",
            expectedValue: 400,
            actualValue: 200,
            isPassed: true,
          },
        ],
      },
      {
        description: "Negative status code test",
        response: {
          status: 200,
          headers: {
            "content-type": "application/json",
            "content-length": "100",
          },
          data: { name: "test" },
        },
        rules: [
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
            expectedValue: 200,
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
            expectedValue: 100,
          },
        ],
        expected: [
          {
            type: "status_code",
            comparator: "equals",
            targetPath: "",
            expectedValue: 400,
            actualValue: 200,
            isPassed: false,
          },
          {
            type: "status_code",
            comparator: "not_equals",
            targetPath: "",
            expectedValue: 200,
            actualValue: 200,
            isPassed: false,
          },
          {
            type: "status_code",
            comparator: "gt",
            targetPath: "",
            expectedValue: 400,
            actualValue: 200,
            isPassed: false,
          },
          {
            type: "status_code",
            comparator: "lt",
            targetPath: "",
            expectedValue: 200,
            actualValue: 200,
            isPassed: false,
          },
          {
            type: "status_code",
            comparator: "gte",
            targetPath: "",
            expectedValue: 400,
            actualValue: 200,
            isPassed: false,
          },
          {
            type: "status_code",
            comparator: "lte",
            targetPath: "",
            expectedValue: 100,
            actualValue: 200,
            isPassed: false,
          },
        ],
      },
    ];

    testCases.forEach(({ description, response, rules, expected }) => {
      it(description, async () => {
        const result = await testResultAnalyzer.analyze(response, rules);
        expect(result).toEqual(expected);
      });
    });
  });

  describe("Analyze Headers", () => {
    // Array of test cases
    const testCases = [
      {
        description: "Positive headers test",
        response: {
          status: 200,
          headers: {
            "content-type": "application/json",
            "content-length": "100",
          },
          data: { name: "test" },
        },
        rules: [
          {
            type: "header",
            targetPath: "content-type",
            comparator: "equals",
            expectedValue: "application/json",
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
            comparator: "contains",
            expectedValue: "json",
          },
          {
            type: "header",
            targetPath: "content-type",
            comparator: "not_contains",
            expectedValue: "xml",
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
            comparator: "lt",
            expectedValue: "1000",
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
            comparator: "lte",
            expectedValue: "1000",
          },
        ],
        expected: [
          {
            type: "header",
            targetPath: "content-type",
            comparator: "equals",
            expectedValue: "application/json",
            actualValue: "application/json",
            isPassed: true,
          },
          {
            type: "header",
            targetPath: "content-type",
            comparator: "not_equals",
            expectedValue: "application/xml",
            actualValue: "application/json",
            isPassed: true,
          },
          {
            type: "header",
            targetPath: "content-type",
            comparator: "contains",
            expectedValue: "json",
            actualValue: "application/json",
            isPassed: true,
          },
          {
            type: "header",
            targetPath: "content-type",
            comparator: "not_contains",
            expectedValue: "xml",
            actualValue: "application/json",
            isPassed: true,
          },
          {
            type: "header",
            targetPath: "content-length",
            comparator: "gt",
            expectedValue: "90",
            actualValue: "100",
            isPassed: true,
          },
          {
            type: "header",
            targetPath: "content-length",
            comparator: "lt",
            expectedValue: "1000",
            actualValue: "100",
            isPassed: true,
          },
          {
            type: "header",
            targetPath: "content-length",
            comparator: "gte",
            expectedValue: "100",
            actualValue: "100",
            isPassed: true,
          },
          {
            type: "header",
            targetPath: "content-length",
            comparator: "lte",
            expectedValue: "1000",
            actualValue: "100",
            isPassed: true,
          },
        ],
      },
      {
        description: "Positive headers test",
        response: {
          status: 200,
          headers: {
            "content-type": "application/json",
            "content-length": "100",
          },
          data: { name: "test" },
        },
        rules: [
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
            expectedValue: "application/json",
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
            expectedValue: "json",
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
            expectedValue: "90",
          },
        ],
        expected: [
          {
            type: "header",
            targetPath: "content-type",
            comparator: "equals",
            expectedValue: "application/xml",
            actualValue: "application/json",
            isPassed: false,
          },
          {
            type: "header",
            targetPath: "content-type",
            comparator: "not_equals",
            expectedValue: "application/json",
            actualValue: "application/json",
            isPassed: false,
          },
          {
            type: "header",
            targetPath: "content-type",
            comparator: "contains",
            expectedValue: "xml",
            actualValue: "application/json",
            isPassed: false,
          },
          {
            type: "header",
            targetPath: "content-type",
            comparator: "not_contains",
            expectedValue: "json",
            actualValue: "application/json",
            isPassed: false,
          },
          {
            type: "header",
            targetPath: "content-length",
            comparator: "gt",
            expectedValue: "1000",
            actualValue: "100",
            isPassed: false,
          },
          {
            type: "header",
            targetPath: "content-length",
            comparator: "lt",
            expectedValue: "100",
            actualValue: "100",
            isPassed: false,
          },
          {
            type: "header",
            targetPath: "content-length",
            comparator: "gte",
            expectedValue: "1000",
            actualValue: "100",
            isPassed: false,
          },
          {
            type: "header",
            targetPath: "content-length",
            comparator: "lte",
            expectedValue: "90",
            actualValue: "100",
            isPassed: false,
          },
        ],
      },
    ];

    testCases.forEach(({ description, response, rules, expected }) => {
      it(description, async () => {
        const result = await testResultAnalyzer.analyze(response, rules);
        expect(result).toEqual(expected);
      });
    });
  });

  describe("Analyze Body", () => {
    const testCases = [
      {
        description: "BODY - Equals operator ",
        response: {
          status: 200,
          headers: {
            "content-type": "application/json",
            "content-length": "100",
          },
          data: { name: "test" },
        },
        rules: [
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
        ],
        expected: [
          {
            type: "body",
            targetPath: '{"name":"test"}',
            comparator: "equals",
            expectedValue: '{"name":"test"}',
            actualValue: '{"name":"test"}',
            isPassed: true,
          },
          {
            type: "body",
            targetPath: "name",
            comparator: "equals",
            expectedValue: "test",
            actualValue: '{"name":"test"}',
            isPassed: false,
          },
          {
            type: "body",
            targetPath: "",
            comparator: "not_equals",
            expectedValue: "test",
            actualValue: '{"name":"test"}',
            isPassed: true,
          },
          {
            type: "body",
            targetPath: "name",
            comparator: "not_equals",
            expectedValue: '{"name":"test"}',
            actualValue: '{"name":"test"}',
            isPassed: false,
          },
        ],
      },
      {
        description: "BODY - Contains operator ",
        response: {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
          data: `{
            "name": "test"
          }`,
        },
        rules: [
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
        ],
        expected: [
          {
            type: "body",
            targetPath: "name",
            comparator: "contains",
            expectedValue: "test",
            actualValue: `{
            "name": "test"
          }`,
            isPassed: true,
          },
          {
            type: "body",
            targetPath: "name",
            comparator: "contains",
            expectedValue: "test1",
            actualValue: `{
            "name": "test"
          }`,
            isPassed: false,
          },
          {
            type: "body",
            targetPath: "name",
            comparator: "not_contains",
            expectedValue: "test1",
            actualValue: `{
            "name": "test"
          }`,
            isPassed: true,
          },
          {
            type: "body",
            targetPath: "name",
            comparator: "not_contains",
            expectedValue: "test",
            actualValue: `{
            "name": "test"
          }`,
            isPassed: false,
          },
        ],
      },
      {
        description: "BODY - gt lt gte lte operators",
        response: {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
          data: 100,
        },
        rules: [
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
        ],
        expected: [
          {
            type: "body",
            targetPath: "name",
            comparator: "gt",
            expectedValue: "0",
            actualValue: 100,
            isPassed: true,
          },
          {
            type: "body",
            targetPath: "name",
            comparator: "gt",
            expectedValue: "200",
            actualValue: 100,
            isPassed: false,
          },
          {
            type: "body",
            targetPath: "name",
            comparator: "lt",
            expectedValue: "200",
            actualValue: 100,
            isPassed: true,
          },
          {
            type: "body",
            targetPath: "name",
            comparator: "lt",
            expectedValue: "0",
            actualValue: 100,
            isPassed: false,
          },
          {
            type: "body",
            targetPath: "name",
            comparator: "gte",
            expectedValue: "100",
            actualValue: 100,
            isPassed: true,
          },
          {
            type: "body",
            targetPath: "name",
            comparator: "gte",
            expectedValue: "300",
            actualValue: 100,
            isPassed: false,
          },
          {
            type: "body",
            targetPath: "name",
            comparator: "lte",
            expectedValue: "100",
            actualValue: 100,
            isPassed: true,
          },
          {
            type: "body",
            targetPath: "name",
            comparator: "lte",
            expectedValue: "0",
            actualValue: 100,
            isPassed: false,
          },
        ],
      },
    ];

    testCases.forEach(({ description, response, rules, expected }) => {
      it(description, async () => {
        const result = await testResultAnalyzer.analyze(response, rules);
        expect(result).toEqual(expected);
      });
    });
  });
});
