import { useLog } from "../lib/log";
import express from "express";
import APIKeysService from "../services/settings/apiKeys";
import UserService from "../services/user/user";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

class CLIController {
  constructor(
    private readonly apiKeyService: APIKeysService,
    private readonly userService: UserService,
  ) {}

  async authMiddleware(req: express.Request, res: express.Response, next: any) {
    const authHeader = req.headers["Authorization"] as string;
    if (!authHeader) {
      return res.status(401).send({ message: "unauthorized" });
    }
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "unauthorized" });
    }
    const apiKey = await this.apiKeyService.get(token);
    if (!apiKey) {
      return res.status(401).send({ message: "unauthorized" });
    }
    const userId = apiKey.userId;
    const user = await this.userService.getById(userId);
    if (!user) {
      return res.status(401).send({ message: "unauthorized" });
    }
    res.locals.user = user;
    next();
  }

  getRouter() {
    const router = express.Router();

    router.post("/login", async (req, res) => {
      const { email, token } = req.body;

      const result = await this.apiKeyService.validate(token, email);
      if (!result) {
        return res.status(401).send({ message: "unauthorized" });
      }
      return res.status(200).send({ message: "login" });
    });

    router.post("/sniffers", this.authMiddleware, async (req, res) => {
      return res.status(200).send({ message: "sniffers" });
    });

    router.get("/sniffers", this.authMiddleware, async (req, res) => {
      return res.status(200).send({ message: "sniffers" });
    });

    router.get("/sniffers/:id/start", this.authMiddleware, async (req, res) => {
      return res.status(200).send({ message: "sniffers" });
    });

    router.get("/sniffers/:id/stop", this.authMiddleware, async (req, res) => {
      return res.status(200).send({ message: "sniffers" });
    });

    return { router, path: "/sharkio/api" };
  }
}

export default CLIController;
