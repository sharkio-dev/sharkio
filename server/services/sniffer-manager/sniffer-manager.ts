import { SnifferConfig, PathResponseData } from "../../types";
import { Sniffer } from "../sniffer/sniffer";
import { ISnifferModel } from "../../model/sniffer/sniffers-model-interface";

export class SnifferManager {
  constructor(private readonly snifferModel: ISnifferModel) {}

  async createSniffer(userId: string, snifferConfig: SnifferConfig) {}
  getSniffer(id: string) {}
  async getAllSniffers(userId: string) {}
  async removeSniffer(id: string) {}
  async getSnifferById(id: string) {}
  async editSniffer(
    userId: string,
    existingId: string,
    newConfig: SnifferConfig,
  ) {}
  async setSnifferConfigToStarted(snifferId: string, isStarted: boolean) {}
  async getAllMocks(userId: string) {}
}
