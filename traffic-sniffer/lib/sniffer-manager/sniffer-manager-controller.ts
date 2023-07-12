import { Express, Request, Response } from "express";
import { Sniffer } from "../sniffer/sniffer";
import { SnifferManager } from "./sniffer-manager";

export class SnifferManagerController {
  constructor(private readonly snifferManager: SnifferManager) {}

  setup(app: Express) {
    /**
     * @openapi
     * /sharkio/sniffer/invocation:
     *   get:
     *     tags:
     *      - sniffer
     *     description: Get all request invocation
     *     responses:
     *       200:
     *         description: Returns a all invocations.
     *       500:
     *         description: Server error
     */
    app.get("/sharkio/sniffer/invocation", (req: Request, res: Response) => {
      try {
        res.send(this.snifferManager.stats()).status(200);
      } catch (e) {
        res.sendStatus(500);
      }
    });

    /**
     * @openapi
     * /sharkio/sniffer:
     *   get:
     *     tags:
     *      - sniffer
     *     description: Get all sniffers
     *     responses:
     *       200:
     *         description: Returns a all sniffers
     *       500:
     *         description: Server error
     */
    app.get("/sharkio/sniffer", (req: Request, res: Response) => {
      res.status(200).send(
        this.snifferManager.getAllSniffers().map((sniffer: Sniffer) => {
          const { config, isStarted } = sniffer.stats();
          return {
            config,
            isStarted,
          };
        })
      );
    });

    /**
     * @openapi
     * /sharkio/sniffer/:port:
     *   get:
     *     tags:
     *      - sniffer
     *     description: Get a sniffers
     *     responses:
     *       200:
     *         description: Returns a sniffer
     *       500:
     *         description: Server error
     */
    app.get("/sharkio/sniffer/:port", (req: Request, res: Response) => {
      const { port } = req.params;
      const sniffer = this.snifferManager.getSniffer(+port);

      if (sniffer !== undefined) {
        res.send(sniffer).status(200);
      } else {
        res.sendStatus(404);
      }
    });

    /**
     * @openapi
     * /sharkio/sniffer:
     *   post:
     *     tags:
     *      - sniffer
     *     description: Create a sniffer
     *     requestBody:
     *        description: Create a sniffer
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *     responses:
     *       201:
     *         description: Sniffer created
     *       500:
     *         description: Server error
     */
    app.post("/sharkio/sniffer", (req: Request, res: Response) => {
      const config = req.body;

      try {
        this.snifferManager.createSniffer(config);

        res.sendStatus(201);
      } catch (e: any) {
        res.sendStatus(500);
      }
    });

    /**
     * @openapi
     * /sharkio/sniffer/:port/actions/stop:
     *   post:
     *     tags:
     *      - sniffer
     *     description: Stop a sniffer
     *     parameters:
     *       - name: port
     *         in: query
     *         description: service port
     *         required: true
     *     responses:
     *       200:
     *         description: Sniffer stopped
     *       500:
     *         description: Server error
     */
    app.post(
      "/sharkio/sniffer/:port/actions/stop",
      (req: Request, res: Response) => {
        try {
          const { port } = req.params;

          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            sniffer.stop();
            this.snifferManager.setSnifferConfigToStarted(
              sniffer.getId(),
              false
            );
            res.sendStatus(200);
          } else {
            res.sendStatus(404);
          }
        } catch (e: any) {
          res.sendStatus(500);
        }
      }
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/actions/start:
     *   post:
     *     tags:
     *      - sniffer
     *     description: Start a sniffer
     *     parameters:
     *       - name: port
     *         in: query
     *         description: service port
     *         required: true
     *     responses:
     *       200:
     *         description: Sniffer started
     *       500:
     *         description: Server error
     */
    app.post(
      "/sharkio/sniffer/:port/actions/start",
      async (req: Request, res: Response) => {
        const { port } = req.params;

        try {
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer) {
            await sniffer.start();
            res.sendStatus(200);
            this.snifferManager.setSnifferConfigToStarted(
              sniffer.getId(),
              true
            );
          } else {
            res.sendStatus(404);
          }
        } catch (e: any) {
          res.sendStatus(500);
        }
      }
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port/actions/execute:
     *   post:
     *     tags:
     *      - sniffer
     *     description: Execute a request from a sniffer
     *     parameters:
     *       - name: port
     *         in: query
     *         description: service port
     *         required: true
     *     requestBody:
     *        description: Execute a request from a sniffer
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *     responses:
     *       200:
     *         description: Request executed
     *       500:
     *         description: Server error
     */
    app.post(
      "/sharkio/sniffer/:port/actions/execute",
      async (req: Request, res: Response) => {
        const { port } = req.params;
        const { url, method, invocation } = req.body;
        try {
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            await sniffer
              .execute(url, method, invocation)
              .catch((e) => console.error("error while executing"));
            res.sendStatus(200);
          } else {
            res.sendStatus(404);
          }
        } catch (e: any) {
          res.sendStatus(500);
        }
      }
    );

    /**
     * @openapi
     * /sharkio/sniffer/:port:
     *   delete:
     *     tags:
     *      - sniffer
     *     description: Delete a sniffer
     *     parameters:
     *       - name: port
     *         in: query
     *         description: service port
     *         required: true
     *     responses:
     *       200:
     *         description: Sniffer deleted
     *       500:
     *         description: Server error
     */
    app.delete(
      "/sharkio/sniffer/:port",
      async (req: Request, res: Response) => {
        const { port } = req.params;

        try {
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            this.snifferManager.removeSniffer(+port);
            res.sendStatus(200);
          } else {
            res.sendStatus(404);
          }
        } catch (e: any) {
          res.sendStatus(500);
        }
      }
    );

    /**
     * @openapi
     * /sharkio/sniffer/:existingId:
     *   put:
     *     tags:
     *      - sniffer
     *     description: Edit a sniffer
     *     parameters:
     *       - name: existingId
     *         in: query
     *         description: service id
     *         required: true
     *     requestBody:
     *        description: Edit a sniffer
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *     responses:
     *       200:
     *         description: Sniffer edited
     *       500:
     *         description: Server error
     */
    app.put(
      "/sharkio/sniffer/:existingId",
      async (req: Request, res: Response) => {
        const { existingId } = req.params;
        const { port } = req.body;

        try {
          const sniffer = this.snifferManager.getSnifferById(existingId);

          // verify that there is no sniffer with the port you want to change to.
          const isPortAlreadyExists = this.snifferManager.getSnifferById(
            port.toString()
          );

          if (
            (sniffer !== undefined && !isPortAlreadyExists) ||
            +port === +existingId
          ) {
            await this.snifferManager.editSniffer(existingId, req.body);
            res.sendStatus(200);
          } else if (!sniffer) {
            res.sendStatus(404);
          } else if (isPortAlreadyExists) {
            res.sendStatus(403);
          }
        } catch (e: any) {
          res.sendStatus(500);
        }
      }
    );
  }
}
