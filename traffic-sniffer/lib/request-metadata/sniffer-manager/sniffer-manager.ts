import { Sniffer, SnifferConfig } from "../sniffer/sniffer";
import express, { Express, NextFunction, Request, Response } from "express";
import * as http from "http";

class SnifferManager {
  private readonly sniffers: Sniffer[];
  private app: Express;
  private server: http.Server | undefined;

  constructor() {
    this.sniffers = [];
    this.app = express();
  }

  createSniffer(snifferConfig: SnifferConfig) {
    this.sniffers.push(new Sniffer(snifferConfig));
  }

  getSniffer(port: string) {
    const res = this.sniffers.find((sniffer: Sniffer) => {
      sniffer.getPort();
    });

    return res;
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
