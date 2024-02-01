import { z } from "zod";

export type CreateTestFlowDTO = {
  ownerId: string;
  name: string;
};

export const CreateTestFlowValidator = z.object({
  name: z.string(),
});

export type TestFlowAssertion = {
  path: string;
  comparator: string;
  expectedValue: any;
};

export type TestFlowAssertionResult = TestFlowAssertion & {
  actualValue: any;
  isPassed: boolean;
};

export type CreateTestNodeDTO = {
  name: string;
  proxyId: string;
  request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body: string;
    requestId?: string;
  };
  assertions: TestFlowAssertion[];
};

export const CreateTestNodeValidator = z.object({
  name: z.string(),
  proxyId: z.string(),
  method: z.string(),
  url: z.string(),
  headers: z.record(z.string()),
  body: z.string(),
  requestId: z.string().uuid().optional(),
  assertions: z.array(
    z.object({
      path: z.string(),
      comparator: z.string(),
      expectedValue: z.any(),
    }),
  ),
});
