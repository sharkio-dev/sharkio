import { json } from "body-parser";
import express, { Response, Request, Express, NextFunction } from "express";
import * as http from "http";
import { useLog } from "../log";
import { supabaseClient } from "../auth/supabaseClient";
import cookieParser from "cookie-parser";
import cors from "cors";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

interface IController {
  setup(app: Express): void;
}

const cookieKey = process.env.SUPABASE_COOKIE_KEY!;

export class Server {
  private readonly port: number = 5012;
  private app: Express;
  private server?: http.Server;

  constructor(controllers: IController[]) {
    this.app = express();
    this.app.use(cors({ origin: "*" }));
    this.app.use(json());
    this.app.use(cookieParser());
    this.app.use(this.authMiddleware);
    controllers.forEach((controller) => {
      controller.setup(this.app);
    });
    this.app.use(this.clientErrorHandler);
  }

  async authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.path === "/sharkio/api/auth") {
        return next();
      }
      const access_token = req.cookies[process.env.SUPABASE_COOKIE_KEY!];
      const { data: user, error } =
        await supabaseClient.auth.getUser(access_token);

      if (error || !user) {
        res.setHeader(
          "Set-Cookie",
          `${cookieKey}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure`,
        );
        res.sendStatus(401);
      } else {
        res.locals.auth = user;
        next();
      }
    } catch (err) {
      // res.setHeader(
      //   "Set-Cookie",
      //   `${cookieKey}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure`
      // );
      res.sendStatus(401);
    }
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
