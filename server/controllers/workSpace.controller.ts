import { WorkspaceService } from "../services/workspace/workspace.service";
import PromiseRouter from "express-promise-router";
import { IRouterConfig } from "./router.interface";
import { Request, Response } from "express";

console.log("workspace controller");
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly baseUrl: string = "/sharkio/workspace",
  ) {}

  getRouter(): IRouterConfig {
    const router = PromiseRouter();
    router
      .route("")
      .get(
        /**
         * @openapi
         * /sharkio/workspace:
         *   get:
         *     tags:
         *      - workspace
         *     description: Get all workspaces
         *     responses:
         *       200:
         *         description: Returns all workspaces
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response) => {
          console.log("get all, req.params:", req.params);
          const userId = res.locals.auth.user.id;
          const workspaces = await this.workspaceService.getUserWorkspaces(
            userId,
          );
          res.json(workspaces);
        },
      )
      .post(
        /**
         * @openapi
         * /sharkio/workspace:
         *   post:
         *     tags:
         *      - workspace
         *     description: Create a workspace
         *     requestBody:
         *        description: Create a workspace
         *        content:
         *          application/json:
         */
        async (req: Request, res: Response) => {
          console.log("add new workspace, req.body:", req.body);
          const { newWorkSpaceName } = req.body;
          const userId = res.locals.auth.user.id;
          const newWorkspace = await this.workspaceService.createWorkspace(
            newWorkSpaceName,
            userId,
          );
          res.json(newWorkspace);
        },
      );

    router
      .route("/:workspaceId")
      .get(
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
          console.log("get one workspace, req.params:", req.params);
          const userId = res.locals.auth.user.id;
          const { workspaceId } = req.params;
          const workspace = await this.workspaceService.getWorkspace(
            userId,
            workspaceId,
          );
          res.json(workspace);
        },
      )
      .delete(async (req: Request, res: Response) => {
        console.log("delete project");
        const userId = res.locals.auth.user.id;
        const { workspaceId } = req.params;
        await this.workspaceService.deleteWorkspace(userId, workspaceId);
        res.json({ success: true });
      })
      .put(async (req: Request, res: Response) => {
        console.log("edit workspace, body:", req.body);
        const userId = res.locals.auth.user.id;
        const { workspaceId } = req.params;
        const { newWorkspaceName } = req.body;
        const newWorkspace = await this.workspaceService.changeWorkspaceName(
          userId,
          workspaceId,
          newWorkspaceName,
        );
        res.json(newWorkspace);
      });

    return {
      router,
      path: this.baseUrl,
    };
  }
}
