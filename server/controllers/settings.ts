import { useLog } from "../lib/log";
import express from "express";
import APIKeysService from "../services/settings/apiKeys";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

const router = express.Router();
const apiKeysService = new APIKeysService();

router.get("/sharkio/api/settings/api-keys", async (req, res) => {
  await apiKeysService.getAll("userId");
});

router.post("/sharkio/api/settings/api-keys", async (req, res) => {
  // const { apiKey } = req.body;
  apiKeysService.add("userId", "apiKey");
  return res.sendStatus(200);
});

class SettingsController {
  setup(app: express.Express) {
    app.use(router);
  }
}

export default SettingsController;
