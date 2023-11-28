import express, { Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import jwt from "jsonwebtoken";
import { useLog } from "../lib/log";
import APIKeysService from "../services/settings/apiKeys";
import { SnifferService } from "../services/sniffer/sniffer.service";
import UserService from "../services/user/user";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

const SECRET_KEY = "sharkio";

class CLIController {
  constructor(
    private readonly apiKeyService: APIKeysService,
    private readonly userService: UserService,
    private readonly snifferService: SnifferService
  ) {
    this.authMiddleware = this.authMiddleware.bind(this);
  }

  async authMiddleware(req: express.Request, res: express.Response, next: any) {
    try {
      const authHeader = req.headers["authorization"] as string;

      if (!authHeader) {
        log.error("no auth header");
        return res.status(401).send({ message: "unauthorized" });
      }
      if (!authHeader.startsWith("Bearer ")) {
        log.error("no bearer");
        return res.status(401).send({ message: "unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        log.error("no token");
        return res.status(401).send({ message: "unauthorized" });
      }
      const decodedToken: any = await jwt.verify(token, SECRET_KEY);
      const user = await this.userService.getById(decodedToken.userId);
      if (!user) {
        return res.status(401).send({ message: "unauthorized" });
      }

      res.locals.user = user;
      next();
    } catch (error) {
      log.error(error);
      return res.status(401).send({ message: "unauthorized" });
    }
  }

  getRouter() {
    const router = PromiseRouter();

    router.route("/login").post(
      /**
       * @openapi
       * /sharkio/api/sniffer/login:
       *   post:
       *     tags:
       *      - cli
       *     description: Create a local sniffer from cli
       *     requestBody:
       *        description: Create a local sniffer from cli
       *        content:
       *          application/json:
       *            schema:
       *              type: object
       *              required:
       *                - apiKey
       *              properties:
       *                apiKey:
       *                  type: string
       *                  description: The api key from the dashboard
       *                  example: 4b5c865347daf19874c7792184262cf75ea1474488df6f769a941323e099063b
       */
      async (req, res) => {
        const { email, token } = req.body;

        const result = await this.apiKeyService.validate(token, email);
        const user = await this.userService.getByEmail(email);
        if (!user) {
          return res.status(401).send({ message: "unauthorized" });
        }
        const jwtToken = jwt.sign(
          { userId: user.id, email, token },
          SECRET_KEY
        );

        if (!result) {
          return res.status(401).send({ message: "unauthorized" });
        }
        return res.status(200).send({ message: "login", jwt: jwtToken });
      }
    );

    router.route("/sniffers").patch(
      this.authMiddleware,
      /**
       * @openapi
       * /sharkio/api/sniffers:
       *   patch:
       *     tags:
       *      - cli
       *     description: Patch sniffers
       *     responses:
       *       200:
       *         description: Local sniffers patched successfully
       *       500:
       *         description: Server error
       */
      async (req, res) => {
        try {
          const userId = res.locals.user.id;
          const { downstreamUrl, port, name } = req.body;

          const sniffer = await this.snifferService.findByName(userId, name);
          if (!sniffer) {
            return res.status(404).send({ message: "sniffer not found" });
          }
          await this.snifferService.editSniffer({
            id: sniffer.id,
            name,
            downstreamUrl,
            userId,
          });
          return res.status(200).send({ message: "sniffer updated" });
        } catch (error) {
          log.error(error);
          return res.status(500).send({ message: "internal server error" });
        }
      }
    );

    router.route("/sniffers").get(
      this.authMiddleware,
      /**
       * @openapi
       * /sharkio/api/sniffers:
       *   get:
       *     tags:
       *      - cli
       *     description: Get sniffers
       *     responses:
       *       200:
       *         description: Local sniffers successfully created
       *       500:
       *         description: Server error
       */
      async (req, res) => {
        const sniffers = await this.snifferService.getUserSniffers(
          res.locals.user.id``
        );
        return res.status(200).send({ sniffers });
      }
    );

    router.route("/sniffer/local").put(
      this.authMiddleware,
      /**
       * @openapi
       * /sharkio/api/sniffer/local:
       *   put:
       *     tags:
       *      - cli
       *     description: Create a local sniffer from cli
       *     requestBody:
       *        description: Create a local sniffer from cli
       *        content:
       *          application/json:
       *            schema:
       *              type: object
       *              required:
       *                - ports
       *                - downstreamUrl
       *              properties:
       *                ports:
       *                  type: array
       *                  description: The ports of the local servers
       *                  minimum: 0
       *                  example: [8080]
       *                downstreamUrl:
       *                  type: string
       *                  description: The URL the sniffer will delegate the request to. Usually ngrok url.
       *                  example: https://5462-2a0d-6fc2-4cf1-9900-d094-decb-a27c-36b9.ngrok.io
       *     responses:
       *       200:
       *         description: Local sniffers successfully created
       *       500:
       *         description: Server error
       */
      async (req: Request, res: Response) => {
        const userId = res.locals.user.id;
        const { ports, downstreamUrl } = req.body;
        const result = await this.snifferService.upsertLocalSniffers(
          userId,
          ports,
          downstreamUrl
        );

        res.json(result);
      }
    );

    return { router, path: "/sharkio/api" };
  }
}

export default CLIController;
