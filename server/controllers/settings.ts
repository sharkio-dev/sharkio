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
      try {
        const ownerId = res.locals.auth.ownerId;
        const keys = await this.apiKeyService.getAll(ownerId);
        return res.status(200).send(keys);
      } catch (e) {
        log.error(e);
        return res.status(500).send({ message: "Internal Server Error" });
      }
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
        try {
          const { name } = req.body;
          const ownerId = res.locals.auth.ownerId;
          const key = await this.apiKeyService.add(ownerId, name);
          return res.status(200).send(key);
        } catch (e) {
          log.error(e);
          return res.status(500).send({ message: "Internal Server Error" });
        }
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
        try {
          const { id: apiKeyId } = req.params;
          const ownerId = res.locals.auth.ownerId;

          await this.apiKeyService.remove(ownerId, apiKeyId);
          return res.sendStatus(200);
        } catch (e) {
          log.error(e);
          return res.status(500).send({ message: "Internal Server Error" });
        }
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
        try {
          const { id: apiKeyId } = req.params;
          const { name } = req.body;
          const ownerId = res.locals.auth.ownerId;

          await this.apiKeyService.update(ownerId, apiKeyId, name);
          return res.sendStatus(200);
        } catch (e) {
          log.error(e);
          return res.status(500).send({ message: "Internal Server Error" });
        }
      },
    );
    return { router, path: "/sharkio/settings/api-keys" };
  }
}

export default SettingsController;
