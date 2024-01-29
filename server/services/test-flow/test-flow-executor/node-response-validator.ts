import {
  TestFlowAssertion,
  TestFlowAssertionResult,
} from "../../../dto/in/test-flow.dto";
import { TestFlowNode } from "../../../model/entities/test-flow/TestFlowNode";
import { AxiosResponse } from "axios";
import { get } from "lodash";

export type AssertionResult = {
  node: TestFlowNode;
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
    };
  }

  async assert(
    testFlowNode: TestFlowNode,
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
        passed.push({
          ...currentAssertion,
          isPassed: false,
          actualValue: result.data,
        });
        success = false;
      }
    }

    return {
      node: testFlowNode,
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
    return expected === data;
  }
}
