import { NextFunction, Request, Response } from "express";

export const dynamicCorsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const origin = req.headers.origin ?? "";
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "TRACE,HEAD,PATCH,GET,POST,PUT,DELETE,OPTIONS",
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return res.sendStatus(204);
  } else {
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
  }

  next();
};
