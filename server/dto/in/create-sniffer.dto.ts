import z from "zod";
import { portValidator } from "../../lib/request-validator/general-validators";

export type CreateSnifferDTO = {
  userId: string;
  name: string;
  port: number;
  downstreamUrl: string;
};

export const CreateSnifferValidator = z.object({
  name: z.string(),
  port: portValidator,
  downstreamUrl: z.string().url(),
});
