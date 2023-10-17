import { SnifferConfig } from "../../sniffer/sniffer";
import { SnifferConfigSetup } from "./file-config.types";

export interface ConfigLoader {
  getUserSniffers(userId: string): Promise<SnifferConfigSetup[]>;
  getAllUsersSniffers(): Promise<SnifferConfigSetup[]>;
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
