import z from "zod";

export type EditSnifferDTO = {
  id: string;
  userId: string;
  name?: string;
  subdomain?: string;
  downstreamUrl?: string;
};

export const EditSnifferValidator = z.object({
  name: z.string().optional(),
  subdomain: z.string().optional(),
  downstreamUrl: z.string().url().optional(),
});
