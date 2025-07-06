import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import Router from "express-promise-router";
import jwt from "jsonwebtoken";
import { useLog } from "../lib/log";
import { Users } from "../model/entities/Users";
import UserService from "../services/user/user";
import { IRouterConfig } from "./router.interface";
import { v4 as uuidv4 } from "uuid";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class AuthController {
  constructor(private readonly userService: UserService) { }

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
          const user = await this.userService.getByEmail(email);

          log.debug(`user ${email}`);

          if (user == null) {
            res.sendStatus(401);
            return;
          }

          const isMatch = await bcrypt.compare(password, user?.password);
          log.debug(`user ${JSON.stringify({ email, isMatch })}`);
          const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });

          res.setHeader("Content-Type", "text/plain");
          res.send(`Bearer ${token}`);
        } catch (err) {
          res.sendStatus(401);
        }
      },
    );

    router.post(
      "/sharkio/api/signup/email",
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const { email, password } = req.body;

          // Check if user already exists
          const existingUser = await this.userService.getByEmail(email);
          if (existingUser) return res.status(400).json({ message: "User already exists" });

          // Hash password
          const hashedPassword = await bcrypt.hash(password, 10);
          const uuid = uuidv4();
          // Save user
          await this.userService.upsertUser({
            id: uuid,
            email, password: hashedPassword,
            createdAt: new Date(),
            fullName: email,
            profileImg: null,
            apiKeys: [],
            chats: [],
            messages: [],
            workspaces: [],
            workspacesUsers: null
          });

          res.status(201).json({ message: "User registered successfully" });
        } catch (err) {
          log.error(err);
          res.sendStatus(500);
        }
      }
    );

    router.post("/sharkio/sync-user", async (req: Request, res: Response) => {
      try {
        const { id, email, fullName, profileImg } = req.body;
        const user = await this.userService.upsertUser({
          id,
          email,
          fullName,
          profileImg,
        } as Users);

        res.status(200).send(user);
      } catch (err) {
        log.error(err);
        res.sendStatus(500);
      }
    });

    return { router, path: "" };
  }

  async middleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      if (
        [/\/sharkio\/api\/login\/email/, /\/api-docs\/.*/, /\/sharkio\/api\/.*/]
          .map((regex) => regex.test(req.path))
          .some((value) => value === true)
      ) {
        next();
        return;
      }

      const authorization = req.headers["authorization"];
      const { workspaceId } = req.query;
      const access_token = authorization?.split(" ")[1];

      const { email } = jwt.decode(access_token);
      const user = await this.userService.getByEmail(email);
      
      if (!user) {
        log.error("User not found");
        return res.sendStatus(401);
      } else {
        res.locals.auth = {
          ownerId: workspaceId ?? user.id,
          userId: user.id,
        };
        next()
      }
    } catch (err) {
      log.error(err);
      return res.sendStatus(401);
    }
  }
}
