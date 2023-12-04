import z from "zod";

export type CreateSnifferDTO = {
  userId: string;
  name: string;
  subdomain?: string;
  downstreamUrl: string;
  port?: number;
};

export const CreateSnifferValidator = z.object({
  name: z.string(),
  downstreamUrl: z.string().url(),
  port: z.number().optional(),
  subdomain: z.string().optional(),
});
