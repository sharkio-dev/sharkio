import z from "zod";
import { portValidator } from "../../lib/request-validator/general-validators";

export type EditSnifferDTO = {
  id: string;
  userId: string;
  name?: string;
  port?: number;
  downstreamUrl?: string;
};

export const EditSnifferValidator = z.object({
  name: z.string().optional(),
  port: portValidator.optional(),
  downstreamUrl: z.string().url().optional(),
});
