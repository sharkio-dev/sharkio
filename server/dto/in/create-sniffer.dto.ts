import z from "zod";

export type CreateSnifferDTO = {
  userId: string;
  name: string;
  subdomain: string;
  downstreamUrl: string;
};

export const CreateSnifferValidator = z.object({
  name: z.string(),
  // subdomain: z.string(),
  downstreamUrl: z.string().url(),
});
