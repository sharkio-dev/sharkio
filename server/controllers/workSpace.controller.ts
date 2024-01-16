import { Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import { z } from "zod";
import { requestValidator } from "../lib/request-validator/request-validator";
import { WorkspaceService } from "../services/workspace/workspace.service";
import { IRouterConfig } from "./router.interface";

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
        requestValidator({
          body: z.object({
            newWorkSpaceName: z.string().min(1),
          }),
        }),
        async (req: Request, res: Response) => {
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
         * /sharkio/workspace/{workspaceId}:
         *   get:
         *     tags:
         *      - workspace
         *     description: get requested workspace
         *     parameters:
         *       - name: workspaceId
         *         in: path
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     responses:
         *       200:
         *         description: Returns requested workspace
         *       500:
         *         description: Server error
         */
        requestValidator({
          params: z.object({ workspaceId: z.string().uuid() }),
        }),
        async (req: Request, res: Response) => {
          const userId = res.locals.auth.user.id;
          const { workspaceId } = req.params;

          const workspace = await this.workspaceService.getWorkspace(
            userId,
            workspaceId,
          );

          res.send(workspace);
        },
      )
      .delete(
        /**
         * @openapi
         * /sharkio/workspace/{workspaceId}:
         *   delete:
         *     tags:
         *      - workspace
         *     description: delete requested workspace
         *     parameters:
         *       - name: workspaceId
         *         in: path
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     responses:
         *       200:
         *         description: Returns requested workspace
         *       500:
         *         description: Server error
         */
        requestValidator({
          params: z.object({ workspaceId: z.string().uuid() }),
        }),
        async (req: Request, res: Response) => {
          const userId = res.locals.auth.user.id;
          const { workspaceId } = req.params;
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
         *     parameters:
         *       - name: workspaceId
         *         in: path
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     responses:
         *       200:
         *         description: Returns requested workspace
         *       500:
         *         description: Server error
         */
        requestValidator({
          params: z.object({
            workspaceId: z.string().uuid(),
          }),
          body: z.object({
            newWorkspaceName: z.string().min(1),
          }),
        }),
        async (req: Request, res: Response) => {
          const { workspaceId } = req.params;
          const { newWorkspaceName } = req.body;
          const newWorkspace = await this.workspaceService.changeWorkspaceName(
            workspaceId,
            newWorkspaceName,
          );
          res.json(newWorkspace);
        },
      );

    router.route("/:workspaceId/users/isMember").post(
      /**
       * @openapi
       * /sharkio/workspace/{workspaceId}/users/isMember:
       *   post:
       *     tags:
       *      - workspace
       *     description: Checks if a user is a member
       *     parameters:
       *       - name: workspaceId
       *         in: path
       *         required: true
       *         schema:
       *           type: string
       *           format: uuid
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               userId:
       *                 type: string
       *                 minLength: 1
       *     responses:
       *       200:
       *         description: Returns requested workspace
       *       500:
       *         description: Server error
       */
      requestValidator({
        params: z.object({
          workspaceId: z.string().uuid(),
        }),
      }),
      async (req: Request, res: Response) => {
        const { workspaceId } = req.params;
        const { userId } = req.body;

        const workspaceUsers = await this.workspaceService.isMember(
          workspaceId,
          userId,
        );

        res.json(workspaceUsers);
      },
    );

    router
      .route("/:workspaceId/users")
      .post(
        /**
         * @openapi
         * /sharkio/workspace/{workspaceId}/users:
         *   post:
         *     tags:
         *      - workspace
         *     description: change workspace name
         *     parameters:
         *       - name: workspaceId
         *         in: path
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               newUserId:
         *                 type: string
         *                 minLength: 1
         *     responses:
         *       200:
         *         description: Returns requested workspace
         *       500:
         *         description: Server error
         */
        requestValidator({
          params: z.object({
            workspaceId: z.string().uuid(),
          }),
          body: z.object({
            newUserId: z.string().min(1),
          }),
        }),
        async (req: Request, res: Response) => {
          const userId = res.locals.auth.user.id;
          const { workspaceId } = req.params;
          const { newUserId } = req.body;

          const newWorkspace = await this.workspaceService.addUser(
            userId,
            workspaceId,
            newUserId,
          );

          res.json(newWorkspace);
        },
      )
      .get(
        /**
         * @openapi
         * /sharkio/workspace/{workspaceId}/users:
         *   get:
         *     tags:
         *      - workspace
         *     description: Get workspace users
         *     parameters:
         *       - name: workspaceId
         *         in: path
         *         required: true
         *         schema:
         *           type: string
         *           format: uuid
         *     responses:
         *       200:
         *         description: Returns requested workspace
         *       500:
         *         description: Server error
         */
        requestValidator({
          params: z.object({
            workspaceId: z.string().uuid(),
          }),
        }),
        async (req: Request, res: Response) => {
          const { workspaceId } = req.params;

          const workspaceUsers = await this.workspaceService.getWorkspaceUsers(
            workspaceId,
          );

          res.json(workspaceUsers);
        },
      );

    router.route("/:workspaceId/users/:userId").delete(
      /**
       * @openapi
       * /sharkio/workspace/{workspaceId}/users/{userId}:
       *   delete:
       *     tags:
       *      - workspace
       *     description: Remove user from workspace
       *     parameters:
       *       - name: workspaceId
       *         in: path
       *         required: true
       *         schema:
       *           type: string
       *           format: uuid
       *       - name: userId
       *         in: path
       *         required: true
       *         schema:
       *           type: string
       *           format: uuid
       *     responses:
       *       200:
       *         description: Returns requested workspace
       *       500:
       *         description: Server error
       */
      requestValidator({
        params: z.object({
          workspaceId: z.string().uuid(),
          userId: z.string().uuid(),
        }),
      }),
      async (req: Request, res: Response) => {
        const { workspaceId, userId } = req.params;

        const result = await this.workspaceService.removeUser(
          userId,
          workspaceId,
        );

        res.send(result).status(200);
      },
    );

    return {
      router,
      path: this.baseUrl,
    };
  }
}
