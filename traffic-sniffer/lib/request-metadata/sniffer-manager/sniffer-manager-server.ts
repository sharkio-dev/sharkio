import { json } from "body-parser";
import express, { Express } from "express";
import * as http from "http";

interface IController {
  setup(app: Express): void;
}

export class SnifferManagerServer {
  private readonly port: number = 5012;
  private app: Express;
  private server: http.Server | undefined;

  constructor(controllers: IController[]) {
    this.app = express();
    this.app.use(json());
    controllers.forEach((controller) => {
      controller.setup(this.app);
    });
  }
  start() {
    this.server = this.app.listen(this.port, () => {
      console.log("server started listening on port 5012");
    });
  }

  stop() {
    this.server?.close();
  }
}
