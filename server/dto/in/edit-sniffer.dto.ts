import z from "zod";

export type EditSnifferDTO = {
  id: string;
  ownerId: string;
  name?: string;
  subdomain?: string;
  downstreamUrl?: string;
  disableRecording?: boolean;
};

export const EditSnifferValidator = z.object({
  name: z.string().optional(),
  subdomain: z.string().optional(),
  downstreamUrl: z.string().url().optional(),
  disableRecording: z.boolean().optional(),
});
