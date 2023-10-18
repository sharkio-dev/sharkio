import { SnifferConfig, PathResponseData } from "../../types";
import { Sniffer } from "../sniffer/sniffer";
import { ISnifferModel } from "../../model/sniffer/sniffers-model-interface";

export class SnifferManager {
  private readonly sniffers: Sniffer[];

  constructor(private readonly snifferModel: ISnifferModel) {
    this.sniffers = [];
  }

  async createSniffer(userId: string, snifferConfig: SnifferConfig) {
    const sniffer = this.getSniffer(snifferConfig.id);

    if (sniffer !== undefined) {
      throw new Error("Sniffer with the same port already exists");
    }

    const newSniffer = new Sniffer(snifferConfig, userId);

    this.sniffers.push(newSniffer);
    await this.snifferModel.addSniffer(userId, snifferConfig);
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

  async getAllSniffers(userId: string) {
    return this.snifferModel.getUserSniffers(userId);
  }

  async removeSniffer(id: string) {
    await this.snifferModel.removeSniffer(id);
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
    await this.snifferModel.update(
      userId,
      existingId,
      newConfig,
      this.sniffers[existingIndex].getIsStarted(),
    );
  }

  async loadSniffersFromConfig() {
    const sniffers = await this.snifferModel.getAllUsersSniffers();
    if (sniffers.length !== 0) {
      sniffers.forEach(async (item) => {
        const sniffer = new Sniffer(item, item.userId);
        this.sniffers.push(sniffer);
      });
    }
  }

  async setSnifferConfigToStarted(snifferId: string, isStarted: boolean) {
    await this.snifferModel.setIsStarted(snifferId, isStarted);
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
