import { z } from "zod";

export type CreateTestFlowDTO = {
  ownerId: string;
  name: string;
};

export const CreateTestFlowValidator = z.object({
  name: z.string(),
});

type AssertionDataType = "string" | "number" | "boolean" | "json";

export type TestFlowAssertion = {
  path: string;
  comparator: string;
  expectedValue: any;
  type: AssertionDataType;
  useTemplateEngine: boolean;
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
  proxyId: z.string().uuid().optional().nullable(),
  subflowId: z.string().uuid().optional().nullable(),
  method: z.string().optional(),
  url: z.string().optional(),
  headers: z.record(z.string()).optional(),
  body: z.string().optional(),
  requestId: z.string().uuid().optional(),
  assertions: z.array(
    z.object({
      path: z.string(),
      comparator: z.string(),
      expectedValue: z.any(),
    }),
  ),
  type: z.string(),
});
