import {
  TestFlowAssertion,
  TestFlowAssertionResult,
} from "../../../dto/in/test-flow.dto";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { AxiosResponse } from "axios";
import { get, includes } from "lodash";
import { TestFlowNodeRun } from "../../../model/entities/test-flow/TestFlowNodeRun";

export type AssertionResult = {
  passed: TestFlowAssertionResult[];
  failed: TestFlowAssertionResult[];
  success: boolean;
};

export class NodeResponseValidator {
  private readonly assertionHandlers: Record<
    string,
    (expected: any, data: any) => boolean
  >;

  constructor() {
    this.assertionHandlers = {
      eq: this.eq,
      ne: this.ne,
      seq: this.eq,
      sne: this.ne,
      gt: this.gt,
      gte: this.gte,
      lt: this.lt,
      lte: this.lte,
      contains: this.contains,
      not_contains: this.notContains,
      includes: this.includes,
      not_includes: this.notIncludes,
      typeof: this.typeof,
    };
  }

  async assert(
    testFlowNode: TestFlowNodeRun,
    response: AxiosResponse,
  ): Promise<AssertionResult> {
    const passed: TestFlowAssertionResult[] = [];
    const failed: TestFlowAssertionResult[] = [];
    let success = true;

    for (let i = 0; i < testFlowNode.assertions.length; i++) {
      const currentAssertion = testFlowNode.assertions[i];
      const result = this.checkAssertion(currentAssertion, response);

      if (result.success) {
        passed.push({
          ...currentAssertion,
          isPassed: true,
          actualValue: result.data,
        });
      } else {
        failed.push({
          ...currentAssertion,
          isPassed: false,
          actualValue: result.data,
        });
        success = false;
      }
    }

    return {
      passed,
      failed,
      success,
    };
  }

  checkAssertion(assertion: TestFlowAssertion, response: AxiosResponse) {
    const data = get(response, assertion.path);

    const assertionResult = this.assertionHandlers[assertion.comparator](
      assertion.expectedValue,
      data,
    );

    return { success: assertionResult, data };
  }

  eq(expected: any, data: any) {
    return expected == data;
  }

  ne(expected: any, data: any) {
    return expected != data;
  }

  seq(expected: any, data: any) {
    return expected === data;
  }

  sne(expected: any, data: any) {
    return expected !== data;
  }

  gt(expected: any, data: any) {
    return data > expected;
  }

  contains(expected: any, data: any) {
    if (typeof data === "string") {
      return data.includes(expected);
    }

    return false;
  }

  notContains(expected: any, data: any) {
    if (typeof data === "string") {
      return !data.includes(expected);
    }

    return false;
  }
  includes(expected: any, data: any) {
    if (Array.isArray(data)) {
      return !data.includes(expected);
    }

    return false;
  }

  notIncludes(expected: any, data: any) {
    if (Array.isArray(data)) {
      return !data.includes(expected);
    }

    return false;
  }

  gte(expected: any, data: any) {
    return data >= expected;
  }

  lt(expected: any, data: any) {
    return data < expected;
  }

  lte(expected: any, data: any) {
    return data <= expected;
  }

  typeof(expected: any, data: any) {
    return typeof data === expected;
  }
}
