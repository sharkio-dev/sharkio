import { PathResponseData } from "../../../types/types";
import { Sniffer, SnifferConfig } from "../sniffer/sniffer";
import { FileConfig, ConfigLoader, SnifferConfigSetup } from "../setup-file"

export class SnifferManager {
  private readonly sniffers: Sniffer[];
  private ConfigData: ConfigLoader;

  constructor() {
    this.sniffers = [];

    this.ConfigData = new FileConfig();
    this.loadSnifferFromConfig();
  }

  createSniffer(snifferConfig: SnifferConfig) {
    const sniffer = this.getSniffer(+snifferConfig.port);

    if (sniffer !== undefined) {
      throw new Error("Sniffer with the same port already exists");
    }
    
    const newSniffer = new Sniffer(snifferConfig);
    this.sniffers.push(newSniffer);
    this.ConfigData.addSniffer(snifferConfig)
    return newSniffer;
  }

  getSniffer(port: number) {
    const res = this.sniffers.find((sniffer: Sniffer) => {
      return sniffer.getPort() === port;
    });

    return res;
  }

  getAllData() {
    let data: PathResponseData[] = [];

    this.sniffers.forEach((sniffer: Sniffer) => {
      data = data.concat(sniffer.getData());
    });

    return data;
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
    this.ConfigData.removeSniffer(port)

  }
  getSnifferById(id: string) {
    const res = this.sniffers.find((sniffer: Sniffer) => {
      return sniffer.getId() === id;
    });

    return res;
  }
  editSniffer(existingId: string, newConfig: SnifferConfig) {
    const existingIndex = this.sniffers.findIndex((sniffer: Sniffer) => {
      return sniffer.getId() === existingId;
    });
    if (this.sniffers[existingIndex].getIsStarted() === true) {
      throw new Error("Cannot edit an active sniffer");
    }
    this.sniffers[existingIndex].editSniffer(newConfig)
    this.ConfigData.update(existingId, newConfig, this.sniffers[existingIndex].getIsStarted())
  }

  loadSnifferFromConfig() {
    const loadedSetup: SnifferConfigSetup[] = this.ConfigData.getSetup()
    if (loadedSetup.length !== 0) {
      loadedSetup.forEach(item => {
        const sniffer: Sniffer = this.createSniffer(item);
        if (item.isStarted) { sniffer.start(); }
      })
    }
  }

  setSnifferConfigToStarted(snifferId: string, isStarted: boolean){
    this.ConfigData.setIsStarted(snifferId, isStarted);
  }
}
