import { WorkspaceService } from "../services/workspace/workspace.service";
import PromiseRouter from "express-promise-router";
import { IRouterConfig } from "./router.interface";
import { Request, Response } from "express";

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
          const userId = res.locals.auth.user.id;
          if (userId === undefined) {
            res.sendStatus(400);
            return;
          }
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
          const { newWorkSpaceName } = req.body;
          const userId = res.locals.auth.user.id;
          if (newWorkSpaceName === "" || userId === undefined) {
            res.sendStatus(400);
            return;
          }
          const newWorkspace = await this.workspaceService.createWorkspace(
            newWorkSpaceName,
            userId,
          );
          res.json(newWorkspace);
        },
      );

    router
      .route("/:workspaceId")
      // .get(
      //   /**
      //    * @openapi
      //    * /sharkio/workspace:
      //    *   get:
      //    *     tags:
      //    *      - workspace
      //    *     description: get requested workspace
      //    *     responses:
      //    *       200:
      //    *         description: Returns requested workspace
      //    *       500:
      //    *         description: Server error
      //    */
      //   async (req: Request, res: Response) => {
      //     const userId = res.locals.auth.user.id;
      //     const { workspaceId } = req.params;
      //     const workspace = await this.workspaceService.getWorkspace(
      //       userId,
      //       workspaceId,
      //     );
      //     res.json(workspace);
      //   },
      // )
      .delete(
        /**
         * @openapi
         * /sharkio/workspace/{workspaceId}:
         *   delete:
         *     tags:
         *      - workspace
         *     description: delete requested workspace
         *     responses:
         *       200:
         *         description: Returns requested workspace
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response) => {
          const userId = res.locals.auth.user.id;
          const { workspaceId } = req.params;
          if (userId === undefined || workspaceId === "") {
            res.sendStatus(400);
            return;
          }
          await this.workspaceService.deleteWorkspace(userId, workspaceId);
          res.json({ success: true });
        },
      )
      .put(
        /**
         * @openapi
         * /sharkio/workspace/{workspaceId}:
         *   put:
         *     tags:
         *      - workspace
         *     description: change workspace name
         *     responses:
         *       200:
         *         description: Returns requested workspace
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response) => {
          const { workspaceId } = req.params;
          const { newWorkspaceName } = req.body;
          if (workspaceId === "" || newWorkspaceName === "") {
            res.sendStatus(400);
            return;
          }
          const newWorkspace = await this.workspaceService.changeWorkspaceName(
            workspaceId,
            newWorkspaceName,
          );
          res.json(newWorkspace);
        },
      );

    return {
      router,
      path: this.baseUrl,
    };
  }
}