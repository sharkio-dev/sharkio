import { Express, NextFunction, Request, Response, Router } from "express";
import { useLog } from "../log";
import { CollectionManager } from "./collection-manager";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class CollectionManagerController {
  constructor(
    private readonly collectionManager: CollectionManager,
    private readonly baseUrl: string = "/sharkio",
  ) {}

  setup(app: Express) {
    const router = Router();

    /**
     * @openapi
     * /sharkio/collection:
     *   get:
     *     tags:
     *       - collection
     *     description: Get all collections
     *     responses:
     *       200:
     *         description: Returns all collections
     *       500:
     *         description: Server error
     */
    router.get(
      "/collection",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const collections = this.collectionManager.getAll();
          res.json(collections).status(200);
        } catch (e) {
          log.error("An unexpected error occured", {
            method: "GET",
            path: `${this.baseUrl}/collection`,
            error: e,
          });
          res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     * /sharkio/collection:
     *   post:
     *     tags:
     *       - collection
     *     description: Create a collection
     *     requestBody:
     *            description: Create a new mock
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    name:
     *                      type: string
     *                      description: Collection name
     *                      example: My collection
     *     responses:
     *       201:
     *         description: Collection created
     *       500:
     *         description: Server error
     */
    router.post(
      "/collection",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { name } = req.body;
          const collections = this.collectionManager.create({
            name,
          });
          res.json(collections).status(200);
        } catch (e) {
          log.error("An unexpected error occured", {
            method: "POST",
            path: `${this.baseUrl}/collection`,
            error: e,
          });
          res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     * /sharkio/collection:
     *   post:
     *     tags:
     *       - collection
     *     description: Create a collection
     *     requestBody:
     *            description: Create a new mock
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    name:
     *                      type: string
     *                      description: Collection name
     *                      example: My collection
     *     responses:
     *       201:
     *         description: Collection created
     *       500:
     *         description: Server error
     */
    router.post(
      `/collection/:id/request`,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { request } = req.body;
          const { id } = req.params;
          await this.collectionManager.addRequest(id, request);
          res.sendStatus(201);
        } catch (e) {
          log.error("An unexpected error occured", {
            method: "POST",
            path: `${this.baseUrl}/collection/invocation`,
            error: e,
          });
          res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     * /sharkio/collection:
     *   post:
     *     tags:
     *       - collection
     *     description: Create a collection
     *     requestBody:
     *            description: Create a new mock
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    name:
     *                      type: string
     *                      description: Collection name
     *                      example: My collection
     *     responses:
     *       201:
     *         description: Collection created
     *       500:
     *         description: Server error
     */
    router.delete(
      "/collection",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { id } = req.body;
          const collections = this.collectionManager.remove(id);
          res.json(collections).status(200);
        } catch (e) {
          log.error("An unexpected error occured", {
            method: "DELETE",
            path: `${this.baseUrl}/collection`,
            error: e,
          });
          res.sendStatus(500);
        }
      },
    );

    app.use(this.baseUrl, router);
  }
}
