import { PathResponseData } from "../../../types/types";
import { Sniffer, SnifferConfig } from "../sniffer/sniffer";
import { SetupFile } from "../setup-file"

export class SnifferManager {
  private readonly sniffers: Sniffer[];
  private setupFileData: SetupFile;

  constructor() {
    this.sniffers = [];
    
    this.setupFileData = new SetupFile();
    this.loadSnifferFromSetupFile();
  }

  createSniffer(snifferConfig: SnifferConfig) {
    const sniffer = this.getSniffer(+snifferConfig.port);

    if (sniffer !== undefined) {
      throw new Error("Sniffer with the same port already exists");
    }
    
    const newSniffer = new Sniffer(snifferConfig);
    this.sniffers.push(newSniffer);
    this.setupFileData.addSnifferToSetupFile(snifferConfig)
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
    this.setupFileData.removeSnifferFromSetupFile(port)

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
    this.setupFileData.updateSetupFile(existingId, newConfig)
  }

  loadSnifferFromSetupFile() {
    const loadedSetup: SnifferConfig[] = this.setupFileData.getSetup()
    if (loadedSetup.length !== 0) {
      loadedSetup.forEach(item => {
        this.createSniffer(item);
      })
    }
  }
}
