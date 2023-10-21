import { SnifferRepository } from "../../model/sniffer/sniffers.model";
import { SnifferConfig, PathResponseData } from "../../types";

export class SnifferManager {
  constructor(private readonly snifferRepository: SnifferRepository) {}

  async getSniffer(userId: string, id: string) {}
  getUserSniffers(userId: string) {
    return this.snifferRepository.findByUserId(userId);
  }
  async createSniffer(userId: string, snifferConfig: SnifferConfig) {}
  async editSniffer(userId: string, id: string, newConfig: SnifferConfig) {}
  async removeSniffer(userId: string, id: string) {}
  async startSniffer(userId: string, id: string) {}
  async stopSniffer(userId: string, id: string) {}
}
