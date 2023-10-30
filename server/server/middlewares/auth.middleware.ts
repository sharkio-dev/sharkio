import { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { supabaseClient } from "../../lib/supabase-client/supabase-client";
import { useLog } from "../../lib/log";

const cookieKey = process.env.SUPABASE_COOKIE_KEY!;
const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (
      [/\/sharkio\/api\/auth/, /\/api-docs\/.*/, /\/sharkio\/api\/.*/]
        .map((regex) => regex.test(req.path))
        .some((value) => value === true)
    ) {
      return next();
    }
    const access_token = req.cookies[process.env.SUPABASE_COOKIE_KEY!];
    const { data: user, error } =
      await supabaseClient.auth.getUser(access_token);

    if (error || !user) {
      log.error(error);
      res.setHeader(
        "Set-Cookie",
        `${cookieKey}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure`,
      );
      res.sendStatus(401);
    } else {
      res.locals.auth = user;
      next();
    }
  } catch (err) {
    log.error(err);
    res.setHeader(
      "Set-Cookie",
      `${cookieKey}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure`,
    );
    res.sendStatus(401);
  }
};
