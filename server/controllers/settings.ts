import { useLog } from "../lib/log";
import express from "express";
import APIKeysService from "../services/settings/apiKeys";
import ApiKeyRepository from "../model/apikeys/apiKeys.model";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

class SettingsController {
  constructor(private readonly apiKeyService: APIKeysService) {}

  getRouter() {
    const router = express.Router();

    router.get("/sharkio/settings/api-keys", async (req, res) => {
      const user = res.locals.auth;
      console.log(user.user.id);
      const keys = await this.apiKeyService.getAll(user.user.id);
      return res.status(200).send(keys);
    });

    router.post("/sharkio/settings/api-keys", async (req, res) => {
      const { name } = req.body;
      const user = res.locals.auth;
      const key = await this.apiKeyService.add(user.user.id, name);
      return res.status(200).send(key);
    });

    router.delete("/sharkio/settings/api-keys/:id", async (req, res) => {
      const { id: apiKeyId } = req.params;
      const user = res.locals.auth;

      await this.apiKeyService.remove(user.user.id, apiKeyId);
      return res.sendStatus(200);
    });

    router.put("/sharkio/settings/api-keys/:id", async (req, res) => {
      const { id: apiKeyId } = req.params;
      const { name } = req.body;
      const user = res.locals.auth;

      await this.apiKeyService.update(user.user.id, apiKeyId, name);
      return res.sendStatus(200);
    });
    return { router, path: "" };
  }
}

export default SettingsController;
