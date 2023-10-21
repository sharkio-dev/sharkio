import { useLog } from "../lib/log";
import express from "express";
import APIKeysService from "../services/settings/apiKeys";
import ApiKeyRepository from "../model/apikeys/apiKeys.model";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

class SettingsController {
  getRouter() {
    const router = express.Router();
    const apiKeysService = new APIKeysService();

    router.get("/sharkio/settings/api-keys", async (req, res) => {
      const user = res.locals.auth;
      console.log(user);
      const keys = apiKeysService.getAll(user.id);
      return res.status(200).send(keys);
    });

    router.post("/sharkio/settings/api-keys", (req, res) => {
      const { name } = req.body;
      const key = apiKeysService.add("userId", name);
      return res.status(200).send(key);
    });

    router.delete("/sharkio/settings/api-keys/:id", (req, res) => {
      const { id } = req.params;
      apiKeysService.remove("userId", id);
      return res.sendStatus(200);
    });

    router.put("/sharkio/settings/api-keys/:id", (req, res) => {
      const { id } = req.params;
      const { name } = req.body;

      console.log(req.body);
      apiKeysService.update("userId", id, name);
      return res.sendStatus(200);
    });
    return { router, path: "" };
  }
}

export default SettingsController;
