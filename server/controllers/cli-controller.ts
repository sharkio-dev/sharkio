import { useLog } from "../lib/log";
import express from "express";
import APIKeysService from "../services/settings/apiKeys";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

class CLIController {
  constructor(private readonly apiKeyService: APIKeysService) {}

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

    router.post("/sniffers", async (req, res) => {
      return res.status(200).send({ message: "sniffers" });
    });

    router.get("/sniffers", async (req, res) => {
      return res.status(200).send({ message: "sniffers" });
    });

    router.get("/sniffers/:id/start", async (req, res) => {
      return res.status(200).send({ message: "sniffers" });
    });

    router.get("/sniffers/:id/stop", async (req, res) => {
      return res.status(200).send({ message: "sniffers" });
    });

    return { router, path: "/sharkio/api" };
  }
}

export default CLIController;
