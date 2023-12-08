import { WorkspaceService } from "../services/workspace/workspace.service";
import PromiseRouter from "express-promise-router";
import { IRouterConfig } from "./router.interface";
import { Request, Response } from "express";

export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly baseUrl: string = "/sharkio/sniffer"
  ) {}

  getRouter(): IRouterConfig {
    const router = PromiseRouter();
    router.route("").get(
      /**
       * @openapi
       * /sharkio/workspace:
       *   get:
       *     tags:
       *      - workspace
       *     description: get requested workspace
       *     responses:
       *       200:
       *         description: Returns requested workspace
       *       500:
       *         description: Server error
       */
      async (req: Request, res: Response) => {
        const userId = res.locals.auth.user.id;
        const workspaceId = req.query.workspaceId as string;
        const workspace = await this.workspaceService.getWorkspace(
          userId,
          workspaceId
        );
        res.json(workspace);
      }
    );
    return {
      router,
      path: this.baseUrl,
    };
  }
}
