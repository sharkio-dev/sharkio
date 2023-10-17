import { BlobOptions } from "buffer";
import { SnifferConfig } from "../../sniffer/sniffer";
import z from "zod";

export type SnifferConfigSetup = SnifferConfig & { isStarted: boolean };

const snifferConfigValidator = z.object({
  name: z.string().nullable().optional(),
  port: z.number().nullable().optional(),
  downstreamUrl: z.string().nullable().optional(),
  id: z.string(),
  isStarted: z.boolean().nullable().optional(),
});

export const sniffersConfigValidator = z.array(snifferConfigValidator);
