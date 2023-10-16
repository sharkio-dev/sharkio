import { json } from "body-parser";
import express, { Express } from "express";
import * as http from "http";
import { useLog } from "../log";
import cors from "cors";
const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

interface IController {
  setup(app: Express): void;
}

export class SnifferManagerServer {
  private readonly port: number = 5012;
  private app: Express;
  private server?: http.Server;

  constructor(controllers: IController[]) {
    this.app = express();
    this.app.use(cors({ origin: "*" }));
    this.app.use(json());
    controllers.forEach((controller) => {
      controller.setup(this.app);
    });
  }
  start() {
    this.server = this.app.listen(this.port, () => {
      log.info("Server started listening on port 5012");
    });
  }

  stop() {
    this.server?.close();
  }
}
