import { Express, NextFunction, Request, Response } from "express";
import Router from "express-promise-router";
import { useLog } from "../lib/log";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

const cookieKey = process.env.SUPABASE_COOKIE_KEY!;

export class AuthController {
  constructor(private readonly baseUrl: string = "/api/auth") {}

  setup(app: Express) {
    const router = Router();
    /**
     * @openapi
     * /api/auth:
     *   get:
     *     tags:
     *       - auth
     *     description: Handles cookies for the client
     *     responses:
     *       200:
     *         description: Return a resopnse with the cookie
     *       401:
     *         description: Clear the cookie
     */
    router.post(
      "/sharkio/api/auth",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const {
            event, // This is the event type, either "SIGNED_IN" or "SIGNED_OUT" (from supabase-js)
            session,
          } = req.body;

          log.debug("Auth event fired");
          log.debug(JSON.stringify({ event, session }));
          switch (event) {
            case "SIGNED_IN": {
              // Set the JWT cookie
              res.cookie(cookieKey, session.access_token, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                maxAge: 1000000,
              });
              res.sendStatus(200);
              return;
            }
            case "SIGNED_OUT": {
              res.setHeader(
                "Set-Cookie",
                `${cookieKey}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure`,
              );
              res.sendStatus(200);
              return;
            }
            default:
              res.sendStatus(500);
          }
        } catch (e) {
          log.error("An unexpected error occured", {
            method: "POST",
            path: `${this.baseUrl}`,
            error: e,
          });
          res.sendStatus(500);
        }
      },
    );

    app.use(router);
  }
}
