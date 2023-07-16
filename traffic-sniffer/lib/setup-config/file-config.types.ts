import { SnifferConfig } from "../sniffer/sniffer";

export const setupFilePath =
  process.env.SETUP_FILE_PATH ?? "./sniffers-setup.json";
export type SnifferConfigSetup = SnifferConfig & { isStarted: boolean };
