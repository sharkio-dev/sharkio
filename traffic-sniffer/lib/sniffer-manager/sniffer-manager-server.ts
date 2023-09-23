import { json } from "body-parser";
import express, { Response, Request, Express, NextFunction } from "express";
import * as http from "http";
import { useLog } from "../log";

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
    this.app.use(json());
    this.app.use(this.extractUserIdFromHeader);
    controllers.forEach((controller) => {
      controller.setup(this.app);
    });
    this.app.use(this.clientErrorHandler);
  }

  extractUserIdFromHeader(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userId = req.headers["x-sharkio-user-id"];

    req.body.userId = userId;

    next();
  }

  clientErrorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (req.xhr) {
      log.error(`${req.method} ${req.path} FAILED`);
      res.status(500).send({ error: "Something failed!" });
    } else {
      next(err);
    }
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
