import { SnifferConfig } from "../sniffer/sniffer";
import z from "zod";

export type SnifferConfigSetup = SnifferConfig & { isStarted: boolean };

const snifferConfigValidator = z.object({
  name: z.string(),
  port: z.number(),
  downstreamUrl: z.string(),
  id: z.string(),
  isStarted: z.boolean(),
});

export const sniffersConfigValidator = z.array(snifferConfigValidator);
