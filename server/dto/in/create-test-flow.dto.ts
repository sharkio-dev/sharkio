import { z } from "zod";

export type CreateTestFlowDTO = {
  ownerId: string;
  name: string;
};

export const CreateTestFlowValidator = z.object({
  name: z.string(),
  ownerId: z.string().uuid(),
});
