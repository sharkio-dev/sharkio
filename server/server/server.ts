import cookieParser from "cookie-parser";
import express, { Express, NextFunction, Request, Response } from "express";
import * as http from "http";
import "reflect-metadata";
import { IRouterConfig } from "../controllers/router.interface";
import { useLog } from "../lib/log";
import { authMiddleware } from "./middlewares/auth.middleware";
import { dynamicCorsMiddleware } from "./middlewares/cors.middleware";
import { logMiddleware } from "./middlewares/log.middleware";
import { AuthController } from "../controllers/auth.controller";

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

  constructor(routers: IRouterConfig[], swaggerController: IController, authController: AuthController) {
    this.app = express();
    this.app.use(logMiddleware);
    this.app.use(dynamicCorsMiddleware);
    this.app.use(express.json());
    this.app.use(express.text());
    this.app.use(express.raw());
    this.app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    this.app.use(cookieParser());
    swaggerController.setup(this.app);
    this.app.use(authController.middleware.bind(authController));
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
