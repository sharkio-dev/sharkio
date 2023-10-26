import z from "zod";

const snifferConfigValidator = z.object({
  name: z.string().nullable().optional(),
  subdomain: z.string().nullable().optional(),
  downstreamUrl: z.string().nullable().optional(),
  id: z.string(),
  userId: z.string().uuid(),
  isStarted: z.boolean().nullable().optional(),
});

export const sniffersConfigValidator = z.array(snifferConfigValidator);
