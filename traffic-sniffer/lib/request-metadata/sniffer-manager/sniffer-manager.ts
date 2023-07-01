import { PathResponseData } from "../../../types/types";
import { Sniffer, SnifferConfig } from "../sniffer/sniffer";
import fs from 'fs'


const setupFilePath = '../config/sniffers-setup.json'
export class SnifferManager {
  private readonly sniffers: Sniffer[];
  private setupFileData: SnifferConfig[]; 

  constructor() {
    this.sniffers = [];
    this.setupFileData = this.validateSetupFileExists()
    
    // if flag is added
    this.loadSnifferFromSetupFile()
  }

  createSniffer(snifferConfig: SnifferConfig) {
    const sniffer = this.getSniffer(+snifferConfig.port);

    if (sniffer !== undefined) {
      throw new Error("Sniffer with the same port already exists");
    }
    
    const newSniffer = new Sniffer(snifferConfig);
    this.sniffers.push(newSniffer);
    this.addSnifferToSetupFile(snifferConfig)
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
    this.removeSnifferFromSetupFile(port)

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
    this.updateSetupFile(existingId, newConfig)
  }

  updateSetupFile(existingId: string, newConfig: SnifferConfig) {
    const foundIndex = this.setupFileData.findIndex((item) => item.id === existingId);   
    if (foundIndex === -1) {
      throw new Error("item was not found")
    }
    this.setupFileData[foundIndex] = newConfig;
    fs.writeFileSync(setupFilePath, JSON.stringify(this.setupFileData))
  }

  validateSetupFileExists() {
    if (!fs.existsSync(setupFilePath)) {
      fs.writeFileSync(setupFilePath, JSON.stringify([]), { flag: 'w'});
    }
    
    const setupData: SnifferConfig[] = JSON.parse(fs.readFileSync(setupFilePath, "utf-8"));
    return setupData;    
  }
  
  loadSnifferFromSetupFile() {
    if (this.setupFileData.length !== 0) {
      this.setupFileData.forEach(item => {
      this.createSniffer(item);
      })
    }
  }

  addSnifferToSetupFile(snifferConfig: SnifferConfig) {
    if (this.setupFileData.indexOf(snifferConfig) === -1) {
      this.setupFileData.push(snifferConfig)
      fs.writeFileSync(setupFilePath, JSON.stringify(this.setupFileData))
    }
    else {
      console.log("sniffer already listed");
    }
  }

  removeSnifferFromSetupFile(port: number) {
    const foundIndex = this.setupFileData.findIndex((item) => item.port === port);   
    if (foundIndex === -1) {
      throw new Error("item was not found")
    }
    this.setupFileData.splice(foundIndex, 1);
    fs.writeFileSync(setupFilePath, JSON.stringify(this.setupFileData))
  }
}
