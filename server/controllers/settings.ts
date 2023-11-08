import express from "express";
import APIKeysService from "../services/settings/apiKeys";
import { useLog } from "../lib/log";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

class SettingsController {
  constructor(private readonly apiKeyService: APIKeysService) {}

  getRouter() {
    const router = express.Router();

    router.get("", async (req, res) => {
      const user = res.locals.auth;
      const keys = await this.apiKeyService.getAll(user.user.id);
      return res.status(200).send(keys);
    });

    router.post(
      "",
      /**
       * @openapi
       * /sharkio/settings/api-keys:
       *   get:
       *     tags:
       *       - settings
       *     description: Get all api keys
       *     responses:
       *       200:
       *         description: OK
       *         content:
       *           application/json:
       *             schema:
       *               type: array
       *               items:
       *                 type: object
       *                 properties:
       *                   id:
       *                     type: string
       *                   name:
       *                     type: string
       *                   key:
       *                     type: string
       *                 example:
       *                   id: "123"
       *                   name: "My API Key"
       *                   key: "12345678"
       *       401:
       *         description: Unauthorized
       *       403:
       *         description: Forbidden
       *       404:
       *         description: Not Found
       *       500:
       *         description: Internal Server Error
       */
      async (req, res) => {
        const { name } = req.body;
        const user = res.locals.auth;
        const key = await this.apiKeyService.add(user.user.id, name);
        return res.status(200).send(key);
      },
    );

    router.delete(
      "/:id",
      /**
       * @openapi
       * /sharkio/settings/api-keys:
       *   post:
       *     tags:
       *       - settings
       *     description: Create a new api key
       *     requestBody:
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               name:
       *                 type: string
       *             example:
       *               name: "My API Key"
       *     responses:
       *       200:
       *         description: OK
       *       401:
       *         description: Unauthorized
       *       403:
       *         description: Forbidden
       *       404:
       *         description: Not Found
       *       500:
       *         description: Internal Server Error
       */
      async (req, res) => {
        const { id: apiKeyId } = req.params;
        const user = res.locals.auth;

        await this.apiKeyService.remove(user.user.id, apiKeyId);
        return res.sendStatus(200);
      },
    );

    router.put(
      "/:id",
      /**
       * @openapi
       * /sharkio/settings/api-keys/{id}:
       *   put:
       *     tags:
       *       - settings
       *     description: Update an api key
       *     parameters:
       *       - name: id
       *         in: path
       *         description: The id of the api key to update
       *         required: true
       *         schema:
       *           type: string
       *     requestBody:
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               name:
       *                 type: string
       *           example:
       *             name: "My Updated API Key"
       *     responses:
       *       200:
       *         description: OK
       *       401:
       *         description: Unauthorized
       *       403:
       *         description: Forbidden
       *       404:
       *         description: Not Found
       *       500:
       *         description: Internal Server Error
       */

      async (req, res) => {
        const { id: apiKeyId } = req.params;
        const { name } = req.body;
        const user = res.locals.auth;

        await this.apiKeyService.update(user.user.id, apiKeyId, name);
        return res.sendStatus(200);
      },
    );
    return { router, path: "/sharkio/settings/api-keys" };
  }
}

export default SettingsController;
