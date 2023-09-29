import { SnifferConfig } from "../../../traffic-sniffer/lib/sniffer/sniffer";
export type SnifferConfigSetup = SnifferConfig & { isStarted: boolean };
import z from "zod";

const snifferConfigValidator = z.object({
  name: z.string(),
  port: z.number(),
  downstreamUrl: z.string(),
  id: z.string(),
  isStarted: z.boolean(),
});

export const sniffersConfigValidator = z.array(snifferConfigValidator);
