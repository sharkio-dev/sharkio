import { NextFunction, Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import z from "zod";
import { useLog } from "../lib/log";
import { requestValidator } from "../lib/request-validator/request-validator";
import { MockResponseService } from "../services/mock-response/mock-response.service";
import { IRouterConfig } from "./router.interface";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class MockResponseController {
  constructor(private readonly mockResponseService: MockResponseService) {}

  getRouter(): IRouterConfig {
    const router = PromiseRouter();
    router
      .route("/")
      .get(
        /**
         * @openapi
         * /sharkio/mock-responses:
         *   get:
         *     tags:
         *      - MockResponse
         *     description: Get all mock responses for use
         *     responses:
         *       200:
         *         description: Success
         *       500:
         *         description: Server error
         */

        async (req: Request, res: Response, next: NextFunction) => {
          const userId = res.locals.auth.user.id;
          const userMockResponses = await this.mockResponseService.getByUserId(
            userId
          );

          res.send(userMockResponses).status(200);
        }
      )
      .post(
        /**
         * @openapi
         * /sharkio/mock-responses:
         *   post:
         *     tags:
         *      - MockResponse
         *     description: Create a mock response
         *     requestBody:
         *        description: Create a mock response
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              required:
         *                - body
         *                - headers
         *                - status
         *                - name
         *              properties:
         *                snifferId:
         *                  type: string
         *                  description: The id of the sniffer
         *                  minimum: 0
         *                  example: e07e14fa-fe96-4807-a4a7-86d49f11fbbc
         *                mockId:
         *                  type: string
         *                  description: The id of the mock
         *                  minimum: 0
         *                  example: e07e14fa-fe96-4807-a4a7-86d49f11fbbc
         *                body:
         *                  type: string
         *                  description: The body of the mock response
         *                  minimum: 0
         *                  example: "{\"hello\":\"world\"}"
         *                headers:
         *                  type: string
         *                  description: The headers of the mock response
         *                  example: "{\"content-type\":\"application/json\"}"
         *                status:
         *                  type: number
         *                  description: The status of the response
         *                  example: 200
         *                name:
         *                  type: string
         *                  description: The name of the mock response
         *                  example: example-mock-name
         *     responses:
         *       200:
         *         description: Mock updated successfully
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response, next: NextFunction) => {
          const userId = res.locals.auth.user.id;
          const { mockId, body, headers, status, name, snifferId } = req.body;
          const createdResponse = await this.mockResponseService.createResponse(
            userId,
            mockId,
            {
              snifferId,
              userId,
              body,
              headers,
              status,
              name,
            }
          );
          res.json(createdResponse).status(201);
        }
      );

    router
      .route("/:mockResponseId")
      .get(
        requestValidator({
          params: z.object({ mockId: z.string() }),
        }),
        /**
         * @openapi
         * /sharkio/mock-responses/{mockResponseId}:
         *   get:
         *     tags:
         *      - MockResponse
         *     parameters:
         *       - name: mockResponseId
         *         in: query
         *         schema:
         *           type: string
         *         description: mockResponseId
         *         required: true
         *     description: Get a mock response
         *     responses:
         *       200:
         *         description: Returns a mock response
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response, next: NextFunction) => {
          const userId = res.locals.auth.user.id;
          const { mockId } = req.params;

          const mock = await this.mockResponseService.getById(userId, mockId);
          res.status(200).send(mock);
        }
      )
      .delete(
        /**
         * @openapi
         * /sharkio/mock-responses/{mockResponseId}:
         *   delete:
         *     tags:
         *      - MockResponse
         *     description: Delete a mock response
         *     parameters:
         *       - name: mockResponseId
         *         in: path
         *         schema:
         *           type: string
         *         description: mockResponseId
         *         required: true
         *     responses:
         *       200:
         *         description: Mock response deleted successfully
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response, next: NextFunction) => {
          const userId = res.locals.auth.user.id;
          const { mockResponseId } = req.params;
          await this.mockResponseService.deleteById(userId, mockResponseId);
          res.status(200).send(mockResponseId);
        }
      )
      .patch(
        /**
         * @openapi
         * /sharkio/mock-responses/{mockResponseId}:
         *   patch:
         *     tags:
         *      - MockResponse
         *     description: Update a mock response
         *     parameters:
         *       - name: mockResponseId
         *         in: path
         *         schema:
         *           type: string
         *         description: mockResponseId
         *         required: true
         *     requestBody:
         *        description: Create a mock response
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              required:
         *                - body
         *                - headers
         *                - status
         *                - name
         *              properties:
         *                body:
         *                  type: string
         *                  description: The body of the mock response
         *                  minimum: 0
         *                  example: {"hello":"world"}
         *                headers:
         *                  type: string
         *                  description: The headers of the mock response
         *                  example: example
         *                status:
         *                  type: number
         *                  description: The status of the response
         *                  example: 200
         *                name:
         *                  type: string
         *                  description: The name of the mock response
         *                  example: example-mock-name
         *     responses:
         *       200:
         *         description: Mock updated successfully
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response, next: NextFunction) => {
          const userId = res.locals.auth.user.id;
          const { mockResponseId } = req.params;
          const { body, headers, status, name } = req.body;

          const updatedMock = await this.mockResponseService.editResponse(
            userId,
            mockResponseId,
            {
              body,
              headers,
              status,
              name,
            }
          );

          res.json(updatedMock).status(200);
        }
      );

    return { router, path: "/sharkio/mock-responses" };
  }
}
