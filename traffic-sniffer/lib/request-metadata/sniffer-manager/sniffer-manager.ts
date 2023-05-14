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

  getAllSniffers() {
    return this.sniffers;
  }

  removeSniffer(port: string) {
    const index = this.sniffers.findIndex((sniffer: Sniffer) => {
      sniffer.getPort();
    });

    this.sniffers.splice(index, 1);
  }
}
