import { SnifferConfig } from "../sniffer/sniffer";
import { SnifferConfigSetup } from "./file-config.types";

export interface ConfigLoader {
  configData: SnifferConfigSetup[];
  getConfig(): SnifferConfigSetup[];
  update(
    existingId: string,
    newConfig: SnifferConfig,
    isStarted: boolean
  ): void;
  addSniffer(snifferConfig: SnifferConfig): void;
  removeSniffer(port: number): void;
  setIsStarted(snifferId: string, isStarted: boolean): void;
}
