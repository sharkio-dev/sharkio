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
      /**
       * @openapi
       * /sharkio/settings/api-keys:
       *  get:
       *   description: Get all api keys
       *  responses:
       *   200:
       *   description: OK
       *  content:
       *  application/json:
       *  schema:
       *  type: array
       * items:
       * type: object
       * properties:
       * id:
       * type: string
       * name:
       * type: string
       * key:
       * type: string
       * example:
       * id: 123
       * name: "My API Key"
       * key: "12345678"
       * 401:
       * description: Unauthorized
       * 403:
       * description: Forbidden
       * 404:
       * description: Not Found
       * 500:
       * description: Internal Server Error
       */

      const user = res.locals.auth;
      const keys = await this.apiKeyService.getAll(user.user.id);
      return res.status(200).send(keys);
    });

    router.post("", async (req, res) => {
      /**
       * @openapi
       * /sharkio/settings/api-keys:
       * post:
       * description: Create a new api key
       * requestBody:
       * content:
       * application/json:
       * schema:
       * type: object
       * properties:
       * name:
       * type: string
       * example:
       * name: "My API Key"
       * responses:
       * 200:
       * description: OK
       * 401:
       * description: Unauthorized
       * 403:
       * description: Forbidden
       * 404:
       * description: Not Found
       * 500:
       * description: Internal Server Error
       */
      const { name } = req.body;
      const user = res.locals.auth;
      const key = await this.apiKeyService.add(user.user.id, name);
      return res.status(200).send(key);
    });

    router.delete("/:id", async (req, res) => {
      /**
       * @openapi
       * /sharkio/settings/api-keys/{id}:
       * delete:
       * description: Delete an api key
       * parameters:
       * - name: id
       * in: path
       * description: The id of the api key to delete
       * required: true
       * schema:
       * type: string
       * responses:
       * 200:
       * description: OK
       * 401:
       * description: Unauthorized
       * 403:
       * description: Forbidden
       * 404:
       * description: Not Found
       * 500:
       * description: Internal Server Error
       */
      const { id: apiKeyId } = req.params;
      const user = res.locals.auth;

      await this.apiKeyService.remove(user.user.id, apiKeyId);
      return res.sendStatus(200);
    });

    router.put("/:id", async (req, res) => {
      /**
       * @openapi
       * /sharkio/settings/api-keys/{id}:
       * put:
       * description: Update an api key
       * parameters:
       * - name: id
       * in: path
       * description: The id of the api key to update
       * required: true
       * schema:
       * type: string
       * requestBody:
       * content:
       * application/json:
       * schema:
       * type: object
       * properties:
       * name:
       * type: string
       * example:
       * name: "My API Key"
       * responses:
       * 200:
       * description: OK
       * 401:
       * description: Unauthorized
       * 403:
       * description: Forbidden
       * 404:
       * description: Not Found
       * 500:
       * description: Internal Server Error
       */
      const { id: apiKeyId } = req.params;
      const { name } = req.body;
      const user = res.locals.auth;

      await this.apiKeyService.update(user.user.id, apiKeyId, name);
      return res.sendStatus(200);
    });
    return { router, path: "/sharkio/settings/api-keys" };
  }
}

export default SettingsController;
