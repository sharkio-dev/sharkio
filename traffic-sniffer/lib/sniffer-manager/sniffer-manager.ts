import { PathResponseData } from "../../types";
import { Sniffer, SnifferConfig } from "../sniffer/sniffer";
import { ConfigLoader } from "../setup-config/config-loader-interface";
import { SnifferConfigSetup } from "../setup-config/file-config.types";

export class SnifferManager {
  private readonly sniffers: Sniffer[];

  constructor(private readonly configPersistency: ConfigLoader) {
    this.sniffers = [];
  }

  createSniffer(snifferConfig: SnifferConfig) {
    const sniffer = this.getSniffer(+snifferConfig.port);

    if (sniffer !== undefined) {
      throw new Error("Sniffer with the same port already exists");
    }

    const newSniffer = new Sniffer(snifferConfig);

    this.sniffers.push(newSniffer);
    this.configPersistency.addSniffer(snifferConfig);
    return newSniffer;
  }

  getSniffer(port: number) {
    const res = this.sniffers.find((sniffer: Sniffer) => {
      return sniffer.getPort() === port;
    });

    return res;
  }

  stats() {
    let stats: PathResponseData[] = [];

    this.sniffers.forEach((sniffer: Sniffer) => {
      stats.push(...sniffer.stats().interceptedRequests);
    });

    return stats;
  }

  getAllSniffers() {
    return this.sniffers;
  }

  removeSniffer(port: number) {
    const index = this.sniffers.findIndex((sniffer: Sniffer) => {
      return sniffer.getPort() === port;
    });

    if (this.sniffers[index].getIsStarted() === true) {
      throw new Error("Cannot remove an active sniffer");
    }

    this.sniffers.splice(index, 1);
    this.configPersistency.removeSniffer(port);
  }

  getSnifferById(id: string) {
    const res = this.sniffers.find((sniffer: Sniffer) => {
      return sniffer.getId() === id;
    });

    return res;
  }

  async editSniffer(existingId: string, newConfig: SnifferConfig) {
    const existingIndex = this.sniffers.findIndex((sniffer: Sniffer) => {
      return sniffer.getId() === existingId;
    });

    // Not needed if we stop the sniffer beforehand
    if (this.sniffers[existingIndex].getIsStarted() === true) {
      throw new Error("Cannot edit an active sniffer");
    }

    await this.sniffers[existingIndex].editSniffer(newConfig);
    this.configPersistency.update(
      existingId,
      newConfig,
      this.sniffers[existingIndex].getIsStarted()
    );
  }

  async loadSniffersFromConfig(configPersistency: SnifferConfigSetup[]) {
    if (configPersistency.length !== 0) {
      configPersistency.forEach(async (item) => {
        const sniffer: Sniffer = this.createSniffer(item);

        if (item.isStarted) {
          await sniffer.start();
        }
      });
    }
  }

  setSnifferConfigToStarted(snifferId: string, isStarted: boolean) {
    this.configPersistency.setIsStarted(snifferId, isStarted);
  }

  getAllMocks() {
    return this.sniffers.map((sniffer: Sniffer) => {
      return {
        service: {
          name: sniffer.getConfig().name,
          port: sniffer.getConfig().port,
        },
        mocks: sniffer.getMockManager().getAllMocks(),
      };
    });
  }
}
