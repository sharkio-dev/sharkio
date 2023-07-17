import { Express, Request, Response } from "express";
import { Sniffer, SnifferConfig } from "../sniffer/sniffer";
import { SnifferManager } from "./sniffer-manager";
import { z, ZodError } from "zod";
import { json } from "body-parser";
import { validator } from "../request-validator";

export class SnifferManagerController {
  constructor(private readonly snifferManager: SnifferManager) {}

  setup(app: Express) {
    const portValidator = z.coerce
      .number()
      .nonnegative("Port number cannot be negative");
    app.use(json());

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
        res.status(200).send(this.snifferManager.stats());
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
    app.get(
      "/sharkio/sniffer/:port",
      validator({
        params: z.object({
          port: portValidator,
        }),
      }),
      (req: Request, res: Response) => {
        try {
          const { port } = req.params;
          const sniffer = this.snifferManager.getSniffer(+port);

          if (sniffer !== undefined) {
            return res.send(sniffer.stats()).status(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e) {
          console.error("An unexpected error occured", {
            dir: __dirname,
            file: __filename,
            method: "GET",
            path: "/sharkio/sniffer/:port",
            error: e,
            timestamp: new Date(),
          });
          return res.sendStatus(500);
        }
      }
    );

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
      try {
        const validator = z.object({
          name: z.string().nonempty(),
          port: portValidator,
          downstreamUrl: z.string().nonempty(),
          id: z.string().nonempty(),
        });
        const config = validator.parse(req.body);

        this.snifferManager.createSniffer(config);
        return res.sendStatus(200);
      } catch (e) {
        switch (true) {
          case e instanceof ZodError: {
            const { errors } = e as ZodError;
            return res.status(400).send(errors);
          }

          default: {
            console.error("An unexpected error occured", {
              dir: __dirname,
              file: __filename,
              method: "POST",
              path: "/sharkio/sniffer/:port",
              error: e,
              timestamp: new Date(),
            });
            return res.sendStatus(500);
          }
        }
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
          const validator = z.object({
            port: portValidator,
          });
          const { port } = validator.parse(req.params);

          const sniffer = this.snifferManager.getSniffer(port);

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
          switch (true) {
            case e instanceof ZodError: {
              const { errors } = e as ZodError;
              return res.status(400).send(errors);
            }
            default: {
              console.error("An unexpected error occured", {
                dir: __dirname,
                file: __filename,
                method: "POST",
                path: "/sharkio/sniffer/:port/actions/stop",
                error: e,
                timestamp: new Date(),
              });
              return res.sendStatus(500);
            }
          }
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
        try {
          const validator = z.object({
            port: portValidator,
          });
          const { port } = validator.parse(req.params);
          const sniffer = this.snifferManager.getSniffer(port);

          if (sniffer) {
            await sniffer.start();
            this.snifferManager.setSnifferConfigToStarted(
              sniffer.getId(),
              true
            );
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e: any) {
          switch (true) {
            case e instanceof ZodError: {
              const { errors } = e as ZodError;
              return res.status(400).send(errors);
            }
            default: {
              console.error("An unexpected error occured", {
                dir: __dirname,
                file: __filename,
                method: "POST",
                path: "/sharkio/sniffer/:port/actions/start",
                error: e,
                timestamp: new Date(),
              });
              return res.sendStatus(500);
            }
          }
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
        try {
          const paramsValidator = z.object({
            port: portValidator,
          });
          const bodyValidator = z.object({
            url: z.string().url(),
            method: z
              .string()
              .toLowerCase()
              .pipe(z.enum(["get", "post", "delete", "patch", "put"])),
            invocation: z.object({
              id: z.string().nonempty(),
              timestamp: z.date(),
              body: z.any().optional(),
              headers: z.any().optional(),
              cookies: z.any().optional(),
              params: z.any().optional(),
            }),
          });
          const { port } = paramsValidator.parse(req.params);
          const { url, method, invocation } = bodyValidator.parse(req.body);
          const sniffer = this.snifferManager.getSniffer(port);

          if (sniffer !== undefined) {
            await sniffer
              .execute(url, method, invocation)
              .catch((e) => console.error("error while executing"));
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e: any) {
          switch (true) {
            case e instanceof ZodError: {
              const { errors } = e as ZodError;
              return res.status(400).send(errors);
            }
            default: {
              console.error("An unexpected error occured", {
                dir: __dirname,
                file: __filename,
                method: "POST",
                path: "/sharkio/sniffer/:port/actions/execute",
                error: e,
                timestamp: new Date(),
              });
              return res.sendStatus(500);
            }
          }
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
        try {
          const validator = z.object({
            port: portValidator,
          });
          const { port } = validator.parse(req.params);
          const sniffer = this.snifferManager.getSniffer(port);

          if (sniffer !== undefined) {
            this.snifferManager.removeSniffer(port);
            return res.sendStatus(200);
          } else {
            return res.sendStatus(404);
          }
        } catch (e: any) {
          switch (true) {
            case e instanceof ZodError: {
              const { errors } = e as ZodError;
              return res.status(400).send(errors);
            }
            default: {
              console.error("An unexpected error occured", {
                dir: __dirname,
                file: __filename,
                method: "DELETE",
                path: "/sharkio/sniffer/:port",
                error: e,
                timestamp: new Date(),
              });
              return res.sendStatus(500);
            }
          }
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
        try {
          const paramsValidator = z.object({
            existingId: z.string().nonempty(),
          });
          const bodyValidator = z.object({
            port: portValidator,
          });
          const { existingId } = paramsValidator.parse(req.params);
          const { port } = bodyValidator.parse(req.body);
          const sniffer = this.snifferManager.getSnifferById(existingId);

          // verify that there is no sniffer with the port you want to change to.
          const isPortAlreadyExists = this.snifferManager.getSnifferById(
            port.toString()
          );

          if (
            (sniffer !== undefined && !isPortAlreadyExists) ||
            port === +existingId
          ) {
            await this.snifferManager.editSniffer(existingId, req.body);
            res.sendStatus(200);
          } else if (!sniffer) {
            return res.sendStatus(404);
          } else if (isPortAlreadyExists) {
            return res.sendStatus(403);
          }
        } catch (e: any) {
          switch (true) {
            case e instanceof ZodError: {
              const { errors } = e as ZodError;
              return res.status(400).send(errors);
            }
            default: {
              console.error("An unexpected error occured", {
                dir: __dirname,
                file: __filename,
                method: "PUT",
                path: "/sharkio/sniffer/:existingId",
                error: e,
                timestamp: new Date(),
              });
              return res.sendStatus(500);
            }
          }
        }
      }
    );
  }
}
