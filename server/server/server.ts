import { json } from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import * as http from "http";
import "reflect-metadata";
import { IRouterConfig } from "../controllers/router.interface";
import { useLog } from "../lib/log";
import { authMiddleware } from "./middlewares/auth.middleware";
import { logMiddleware } from "./middlewares/log.middleware";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

interface IController {
  setup(app: Express): void;
}

export class Server {
  private readonly port: number = 5012;
  private app: Express;
  private server?: http.Server;

  constructor(routers: IRouterConfig[], swaggerController: IController) {
    this.app = express();
    this.app.use(logMiddleware);
    this.app.use(cors({ origin: "*" }));
    this.app.use(json());
    this.app.use(cookieParser());
    swaggerController.setup(this.app);

    this.app.use(authMiddleware);
    routers.forEach((router) => {
      this.app.use(router.path, router.router);
    });
    this.app.use(this.clientErrorHandler);
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
