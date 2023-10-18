import { useLog } from "../lib/log";
import express from "express";
import APIKeysService from "../services/settings/apiKeys";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

const router = express.Router();
const apiKeysService = new APIKeysService();

/**
 * @openapi
 * /sharkio/settings/api-keys:
 *   get:
 *     tags:
 *      - Api Keys
 *     description: Get all api keys
 *     responses:
 *       200:
 *         description: Returns all api
 *       500:
 *         description: Server error
 */
router.get("/sharkio/settings/api-keys", async (req, res) => {
  const keys = apiKeysService.getAll("userId");
  return res.status(200).send(keys);
});

router.post("/sharkio/settings/api-keys", (req, res) => {
  const { name } = req.body;
  const key = apiKeysService.add("userId", name);
  console.log(key);
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

class SettingsController {
  setup(app: express.Express) {
    app.use(router);
  }
}

export default SettingsController;
