import { Request, Response, NextFunction, request } from "express";
import { ZodType, ZodError } from "zod";

export interface Validations {
  params?: ZodType;
  body?: ZodType;
}

export const validator =
  (validations: Validations) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      validations.params?.parse(req.params);
      validations.body?.parse(req.body);
      return next();
    } catch (e) {
      if (e instanceof ZodError) {
        const { errors } = e as ZodError;
        return res.status(400).send(errors);
      } else {
        console.error("An unexpected error occured", {
          dir: __dirname,
          file: __filename,
          method: req.method,
          path: req.path,
          error: e,
          timestamp: new Date(),
        });
        return res.sendStatus(500);
      }
    }
  };
