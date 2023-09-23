import { SnifferConfig } from "../../sniffer/sniffer";
import { SnifferConfigSetup } from "./file-config.types";

export interface ConfigLoader {
  getUserConfig(userId: string): Promise<SnifferConfigSetup[]>;
  getAllUsersConfig(): Promise<SnifferConfigSetup[]>;
  update(
    userId: string,
    existingId: string,
    newConfig: SnifferConfig,
    isStarted: boolean,
  ): Promise<void>;
  addSniffer(userId: string, snifferConfig: SnifferConfig): Promise<void>;
  removeSniffer(port: string): Promise<void>;
  setIsStarted(snifferId: string, isStarted: boolean): Promise<void>;
}
