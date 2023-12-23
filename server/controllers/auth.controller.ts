import { NextFunction, Request, Response } from "express";
import Router from "express-promise-router";
import { useLog } from "../lib/log";
import { supabaseClient } from "../lib/supabase-client/supabase-client";
import UserService from "../services/user/user";
import { IRouterConfig } from "./router.interface";
import { User } from "../model/entities/Users";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class AuthController {
  constructor(private readonly userService: UserService) {}

  getRouter(): IRouterConfig {
    const router = Router();

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

          res.send(`Bearer ${authRes.data.session?.access_token}`);
        } catch (err) {
          res.sendStatus(401);
        }
      },
    );

    router.post("/sharkio/sync-user", async (req: Request, res: Response) => {
      try {
        const { id, email, fullName, profileImg } = req.body;

        const user = await this.userService.upsertUser({
          id,
          email,
          fullName,
          profileImg,
        } as User);

        res.status(200).send(user);
      } catch (err) {
        log.error(err);
        res.sendStatus(500);
      }
    });

    return { router, path: "" };
  }
}
