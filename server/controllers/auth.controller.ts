import env from "dotenv/config";
import { NextFunction, Request, Response } from "express";
import Router from "express-promise-router";
import { useLog } from "../lib/log";
import { IRouterConfig } from "./router.interface";
import UserService from "../services/user/user";
import { supabaseClient } from "../lib/supabase-client/supabase-client";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

const cookieKey = process.env.SUPABASE_COOKIE_KEY!;

export class AuthController {
  constructor(private readonly userService: UserService) {}

  getRouter(): IRouterConfig {
    const router = Router();

    /**
     * @openapi
     *  /sharkio/api/auth:
     *     post:
     *       tags:
     *         - auth
     *       description: Handles cookies for the client
     *       requestBody:
     *         description: auth request body
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 event:
     *                   type: string
     *                   enum:
     *                     - SIGNED_IN
     *                     - SIGNED_OUT
     *                 session:
     *                   type: object
     *                   properties:
     *                     access_token:
     *                       type: string
     *       responses:
     *         200:
     *           description: Return a resopnse with the cookie
     *         401:
     *           description: Clear the cookie
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
          log.debug(JSON.stringify({ event }));
          switch (event) {
            case "SIGNED_IN":
            case "INITIAL_SESSION": {
              // Set the JWT cookie
              res.cookie("sharkio-token", session.access_token, {
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
            case "INITIAL_SESSION": {
              res.sendStatus(200);
              return;
            }
            default: {
              res.sendStatus(500);
              return;
            }
          }
        } catch (e) {
          log.error("An unexpected error occured", {
            method: "POST",
            path: `/sharkio/api/auth`,
            error: e,
          });
          res.sendStatus(500);
        }
      },
    );

    /**
     * @openapi
     *  /sharkio/api/login/email:
     *     post:
     *       tags:
     *         - auth
     *       description: Handles cookies for the client
     *       requestBody:
     *         description: auth request body
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 email:
     *                   type: string
     *                 password:
     *                   type: string
     *       responses:
     *         200:
     *           description: Return a resopnse with the cookie
     *         401:
     *           description: Clear the cookie
     */
    router.post(
      "/sharkio/api/login/email",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { email, password } = req.body;

          const authRes = await supabaseClient.auth.signInWithPassword({
            email,
            password,
          });

          if (authRes.data.session) {
            res.cookie("sharkio-token", authRes.data.session.access_token, {
              httpOnly: true,
              secure: true,
              sameSite: "lax",
              maxAge: 1000000,
            });
          }

          res.send(authRes).status(200);
        } catch (err) {
          res.sendStatus(401);
        }
      },
    );

    return { router, path: "" };
  }
}
