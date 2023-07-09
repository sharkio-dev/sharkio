import { Express, Request, Response } from "express";
import { Sniffer, SnifferConfig } from "../sniffer/sniffer";
import { SnifferManager } from "./sniffer-manager";
import { z, ZodError } from "zod";

export class SnifferManagerController {
  constructor(private readonly snifferManager: SnifferManager) {}

  setup(app: Express) {
    const portValidator = z.coerce
      .number()
      .nonnegative("Port number cannot be negative");

    app.get("/sharkio/sniffer/invocation", (req: Request, res: Response) => {
      try {
        res.status(200).send(this.snifferManager.stats());
      } catch (e) {
        res.sendStatus(500);
      }
    });

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

    app.get("/sharkio/sniffer/:port", (req: Request, res: Response) => {
      try {
        const validator = z.object({
          port: portValidator,
        });
        const { port } = validator.parse(req.params);
        const sniffer = this.snifferManager.getSniffer(port);

        if (sniffer !== undefined) {
          return res.send(sniffer).status(200);
        } else {
          return res.sendStatus(404);
        }
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
              method: "GET",
              path: "/sharkio/sniffer/:port",
              error: e,
              timestamp: new Date(),
            });
            return res.sendStatus(500);
          }
        }
      }
    });

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

    app.post(
      "/sharkio/sniffer/:port/actions/execute",
      async (req: Request, res: Response) => {
        try {
          const paramsValidator = z.object({
            port: portValidator,
          });
          const bodyValidator = z.object({
            url: z.string().url(),
            method: z.string().toLowerCase().pipe(z.enum(["get", "post", "delete", "patch", "put"])),
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
            this.snifferManager.editSniffer(existingId, req.body);
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
