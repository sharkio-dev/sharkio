import { PathResponseData } from "../../types";
import { Sniffer, SnifferConfig } from "../sniffer/sniffer";
import { SnifferConfigSetup } from "../model/setup-config/file-config.types";
import { ConfigLoader } from "../model/setup-config/config-loader-interface";

export class SnifferManager {
  private readonly sniffers: Sniffer[];

  constructor(private readonly configPersistency: ConfigLoader) {
    this.sniffers = [];
  }

  async createSniffer(userId: string, snifferConfig: SnifferConfig) {
    const sniffer = this.getSniffer(snifferConfig.id);

    if (sniffer !== undefined) {
      throw new Error("Sniffer with the same port already exists");
    }

    const newSniffer = new Sniffer(snifferConfig);

    this.sniffers.push(newSniffer);
    await this.configPersistency.addSniffer(userId, snifferConfig);
    return newSniffer;
  }

  getSniffer(id: string) {
    const res = this.sniffers.find((sniffer: Sniffer) => {
      return sniffer.getId() === id;
    });

    return res;
  }

  stats(userId: string) {
    let stats: PathResponseData[] = [];

    this.sniffers.forEach(async (sniffer: Sniffer) => {
      const stat = await sniffer.stats(userId);
      stats.push(...stat.interceptedRequests);
    });

    return stats;
  }

  getAllSniffers() {
    return this.sniffers;
  }

  async removeSniffer(id: string) {
    await this.configPersistency.removeSniffer(id);
  }

  getSnifferById(id: string) {
    const res = this.sniffers.find((sniffer: Sniffer) => {
      return sniffer.getId() === id;
    });

    return res;
  }

  async editSniffer(
    userId: string,
    existingId: string,
    newConfig: SnifferConfig,
  ) {
    const existingIndex = this.sniffers.findIndex((sniffer: Sniffer) => {
      return sniffer.getId() === existingId;
    });

    // Not needed if we stop the sniffer beforehand
    if (this.sniffers[existingIndex].getIsStarted() === true) {
      throw new Error("Cannot edit an active sniffer");
    }

    await this.sniffers[existingIndex].editSniffer(newConfig);
    await this.configPersistency.update(
      userId,
      existingId,
      newConfig,
      this.sniffers[existingIndex].getIsStarted(),
    );
  }

  async loadSniffersFromConfig() {
    const sniffers = await this.configPersistency.getAllUsersConfig();
    if (sniffers.length !== 0) {
      sniffers.forEach(async (item) => {
        const sniffer = new Sniffer(item);
        this.sniffers.push(sniffer);
      });
    }
  }

  async setSnifferConfigToStarted(snifferId: string, isStarted: boolean) {
    await this.configPersistency.setIsStarted(snifferId, isStarted);
  }

  async getAllMocks(userId: string) {
    const mocks = await Promise.all(
      this.sniffers.map(async (sniffer: Sniffer) => {
        return {
          service: {
            name: sniffer.getConfig().name,
            port: sniffer.getConfig().port,
          },
          mocks: await sniffer.getMockManager().getAllMocks(userId),
        };
      }),
    );

    return mocks;
  }
}
