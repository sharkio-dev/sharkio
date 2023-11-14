import { NextFunction, Request, Response } from "express";
import { useLog } from "../../lib/log/index";

const logger = useLog({
  dirname: __dirname,
  filename: __filename,
});

export const logMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug(`http: ${req.method} ${req.path}`);
  next();
};
