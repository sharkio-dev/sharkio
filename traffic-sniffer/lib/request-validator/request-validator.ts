import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";
import { useLog } from "../log";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export interface Validations {
  params?: ZodType;
  body?: ZodType;
}

export const requestValidator =
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
        log.error("An unexpected error occured", {
          method: req.method,
          path: req.path,
          error: e,
        });
        return res.sendStatus(500);
      }
    }
  };
