import { useLog } from "../lib/log";
import express from "express";
import APIKeysService from "../services/settings/apiKeys";
import UserService from "../services/user/user";
import { SnifferService } from "../services/sniffer/sniffer.service";
import { supabaseClient } from "../lib/supabase-client/supabase-client";
import jwt from "jsonwebtoken";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

const SECRET_KEY = "sharkio";

class CLIController {
  constructor(
    private readonly apiKeyService: APIKeysService,
    private readonly userService: UserService,
    private readonly snifferService: SnifferService
  ) {
    this.authMiddleware = this.authMiddleware.bind(this);
  }

  async authMiddleware(req: express.Request, res: express.Response, next: any) {
    try {
      const authHeader = req.headers["authorization"] as string;

      if (!authHeader) {
        log.error("no auth header");
        return res.status(401).send({ message: "unauthorized" });
      }
      if (!authHeader.startsWith("Bearer ")) {
        log.error("no bearer");
        return res.status(401).send({ message: "unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        log.error("no token");
        return res.status(401).send({ message: "unauthorized" });
      }
      const decodedToken: any = await jwt.verify(token, SECRET_KEY);
      const user = await this.userService.getById(decodedToken.userId);
      if (!user) {
        return res.status(401).send({ message: "unauthorized" });
      }

      res.locals.user = user;
      next();
    } catch (error) {
      log.error(error);
      return res.status(401).send({ message: "unauthorized" });
    }
  }

  getRouter() {
    const router = express.Router();

    router.post("/login", async (req, res) => {
      const { email, token } = req.body;

      const result = await this.apiKeyService.validate(token, email);
      const user = await this.userService.getByEmail(email);
      if (!user) {
        return res.status(401).send({ message: "unauthorized" });
      }
      const jwtToken = jwt.sign({ userId: user.id, email, token }, SECRET_KEY);

      if (!result) {
        return res.status(401).send({ message: "unauthorized" });
      }
      return res.status(200).send({ message: "login", jwt: jwtToken });
    });

    router.patch("/sniffers", this.authMiddleware, async (req, res) => {
      try {
        const userId = res.locals.user.id;
        const { downstreamUrl, port, name } = req.body;

        const sniffer = await this.snifferService.findByName(userId, name);
        if (!sniffer) {
          return res.status(404).send({ message: "sniffer not found" });
        }
        await this.snifferService.editSniffer({
          id: sniffer.id,
          name,
          downstreamUrl,
          userId,
        });
        return res.status(200).send({ message: "sniffer updated" });
      } catch (error) {
        log.error(error);
        return res.status(500).send({ message: "internal server error" });
      }
    });

    router.get("/sniffers", this.authMiddleware, async (req, res) => {
      const sniffers = await this.snifferService.getUserSniffers(
        res.locals.user.id
      );
      return res.status(200).send({ sniffers });
    });

    return { router, path: "/sharkio/api" };
  }
}

export default CLIController;
