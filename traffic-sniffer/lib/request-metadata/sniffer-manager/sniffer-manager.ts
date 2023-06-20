import { PathResponseData } from "../../../types/types";
import { Sniffer, SnifferConfig } from "../sniffer/sniffer";

export class SnifferManager {
  private readonly sniffers: Sniffer[];

  constructor() {
    this.sniffers = [];
  }

  createSniffer(snifferConfig: SnifferConfig) {
    const sniffer = this.getSniffer(+snifferConfig.port);

    if (sniffer !== undefined) {
      throw new Error("Sniffer with the same port already exists");
    }

    const newSniffer = new Sniffer(snifferConfig);
    this.sniffers.push(newSniffer);
    return newSniffer;
  }

  getSniffer(port: number) {
    const res = this.sniffers.find((sniffer: Sniffer) => {
      return sniffer.getPort() === port;
    });

    return res;
  }

  getAllData() {
    let newData: any[] = [];

    this.sniffers.forEach((sniffer: Sniffer) => {
      const service = sniffer.getServiceName();
      const data = sniffer.getData();
      newData = newData.concat(data.map(obj => ({
        ...obj,
        service: service
      })));
      // do not use concat, add an array with key that contains the sniffer name
    });

    return newData;
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
  }
}
