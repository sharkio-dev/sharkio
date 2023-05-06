import { Sniffer, SnifferConfig } from "../sniffer/sniffer";
import express, { Express, NextFunction, Request, Response } from "express";
import * as http from "http";

export class SnifferManager {
  private readonly sniffers: Sniffer[];
  private app: Express;
  private server: http.Server | undefined;

  constructor() {
    this.sniffers = [];
    this.app = express();
  }

  createSniffer(snifferConfig: SnifferConfig) {
    const newSniffer = new Sniffer(snifferConfig);
    this.sniffers.push(newSniffer);
    return newSniffer;
  }

  getSniffer(port: string) {
    const res = this.sniffers.find((sniffer: Sniffer) => {
      sniffer.getPort();
    });

    return res;
  }

  getAllSniffers(port: string) {
    return this.sniffers;
  }

  removeSniffer(port: string) {
    const index = this.sniffers.findIndex((sniffer: Sniffer) => {
      sniffer.getPort();
    });

    this.sniffers.splice(index, 1);
  }

  setupRoutes() {}

  start() {
    this.server = this.app.listen(5000, () => {
      console.log("server started listening");
    });
  }

  stop() {
    this.server?.close();
  }
}
