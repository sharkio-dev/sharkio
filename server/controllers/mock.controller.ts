import { NextFunction, Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import z from "zod";
import { useLog } from "../lib/log";
import { requestValidator } from "../lib/request-validator/request-validator";
import { MockService } from "../services/mock/mock.service";
import { IRouterConfig } from "./router.interface";
import { MockResponseService } from "../services/mock-response/mock-response.service";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class MockController {
  constructor(
    private readonly mockService: MockService,
    private readonly mockResponseService: MockResponseService
  ) {}

  getRouter(): IRouterConfig {
    const router = PromiseRouter();
    router
      .route("/")
      .get(
        /**
         * @openapi
         * /sharkio/mocks:
         *   get:
         *     tags:
         *      - mock
         *     description: Get all mocks
         *     responses:
         *       200:
         *         description: Returns mocks
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response, next: NextFunction) => {
          const userId = res.locals.auth.user.id;
          const limit = +(req.params.limit ?? 1000);
          const requests = await this.mockService.getByUser(userId, limit);
          res.status(200).send(requests);
        }
      )
      .post(
        /**
         * @openapi
         * /sharkio/mocks:
         *   post:
         *     tags:
         *      - mock
         *     description: Get all mocks
         *     requestBody:
         *        description: Create a mock
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              required:
         *                - method
         *                - url
         *                - body
         *                - headers
         *                - status
         *                - name
         *                - snifferId
         *              properties:
         *                method:
         *                  type: string
         *                  description: The method of the mock
         *                  example: POST
         *                url:
         *                  type: string
         *                  description: The url of the mock
         *                  example: /example
         *                body:
         *                  type: string
         *                  description: The body of the mock
         *                  minimum: 0
         *                  example: {"hello":"world"}
         *                headers:
         *                  type: string
         *                  description: The headers of the mock
         *                  example: example
         *                status:
         *                  type: number
         *                  description: The status of the response
         *                  example: 200
         *                name:
         *                  type: string
         *                  description: The name of the mock
         *                  example: example-mock-name
         *                snifferId:
         *                  type: string
         *                  description: The id of the sniffer
         *                  example: 121ed1e5-0502-4fd3-a3f0-4603fcca1cbc
         *                mockResponses:
         *                  description: The id of the sniffer
         *                  example: [{ "status":200,"body":"","headers":"example","name":"example-response-name","sequenceIndex":1}]
         *                  type: array
         *                  items:
         *                    type: object
         *                    properties:
         *                      status:
         *                        type: number
         *                        description: The status of the response
         *                        example: 200
         *                      body:
         *                        type: string
         *                        description: The body of the response
         *                        example: {"hello":"world"}
         *                      headers:
         *                        type: string
         *                        description: The headers of the response
         *                        example: example
         *                      name:
         *                        type: string
         *                        description: The name of the response
         *                        example: example-response-name
         *                      sequenceIndex:
         *                        type: number
         *                        description: The sequence index of the response
         *                        example: 1
         *     responses:
         *       200:
         *         description: Returns mocks
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response, next: NextFunction) => {
          const userId = res.locals.auth.user.id;
          const {
            headers,
            body,
            status,
            url,
            snifferId,
            name,
            method,
            mockResponses,
            selectedResponseId,
          } = req.body;
          const mock = await this.mockService.create(
            userId,
            url,
            method,
            body,
            headers,
            status,
            name,
            snifferId,
            mockResponses,
            selectedResponseId
          );

          res.status(200).send(mock);
        }
      );

    router
      .route("/:mockId")
      .get(
        requestValidator({
          params: z.object({ mockId: z.string() }),
        }),
        /**
         * @openapi
         * /sharkio/mocks/{mockId}:
         *   get:
         *     tags:
         *      - mock
         *     parameters:
         *       - name: mockId
         *         in: path
         *         schema:
         *           type: string
         *         description: mockId
         *         required: true
         *     description: Get a mock
         *     responses:
         *       200:
         *         description: Returns a mock
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response, next: NextFunction) => {
          const userId = res.locals.auth.user.id;
          const limit = +(req.params.limit ?? 1000);
          const { mockId } = req.params;

          const mock = await this.mockService.getById(userId, mockId);
          res.status(200).send(mock);
        }
      )
      .delete(
        /**
         * @openapi
         * /sharkio/mocks/{mockId}:
         *   delete:
         *     tags:
         *      - mock
         *     description: Delete a mock
         *     parameters:
         *       - name: mockId
         *         in: path
         *         schema:
         *           type: string
         *         description: mockId
         *         required: true
         *     responses:
         *       200:
         *         description: Mock deleted successfully
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response, next: NextFunction) => {
          const userId = res.locals.auth.user.id;
          const { mockId } = req.params;
          const response = await this.mockService.delete(userId, mockId);
          res.status(200).send(response);
        }
      )
      .patch(
        /**
         * @openapi
         * /sharkio/mocks/{mockId}:
         *   patch:
         *     tags:
         *      - mock
         *     description: Update a mock
         *     parameters:
         *       - name: mockId
         *         in: path
         *         schema:
         *           type: string
         *         description: mockId
         *         required: true
         *     requestBody:
         *        description: Create a mock
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              required:
         *                - method
         *                - url
         *                - body
         *                - headers
         *                - status
         *                - name
         *                - snifferId
         *              properties:
         *                method:
         *                  type: string
         *                  description: The method of the mock
         *                  example: POST
         *                url:
         *                  type: string
         *                  description: The url of the mock
         *                  example: /user
         *                body:
         *                  type: string
         *                  description: The body of the mock
         *                  minimum: 0
         *                  example: {"hello":"world"}
         *                headers:
         *                  type: string
         *                  description: The headers of the mock
         *                  example: example
         *                status:
         *                  type: number
         *                  description: The status of the response
         *                  example: 200
         *                name:
         *                  type: string
         *                  description: The name of the mock
         *                  example: example-mock-name
         *                snifferId:
         *                  type: string
         *                  description: The id of the sniffer
         *                  example: 121ed1e5-0502-4fd3-a3f0-4603fcca1cbc
         *     responses:
         *       200:
         *         description: Mock updated successfully
         *       500:
         *         description: Server error
         */
        async (req: Request, res: Response, next: NextFunction) => {
          const userId = res.locals.auth.user.id;
          const { mockId } = req.params;
          const { method, url, body, headers, status, name, snifferId } =
            req.body;

          const updatedMock = await this.mockService.update(
            userId,
            mockId,
            url,
            method,
            body,
            headers,
            status,
            name,
            snifferId
          );

          res.json(updatedMock).status(200);
        }
      );

    router.route("/:mockId/selected-response").patch(
      /**
       * @openapi
       * /sharkio/mocks/{mockId}/selected-response:
       *   post:
       *     tags:
       *      - mock
       *     description: Set mock selected response
       *     parameters:
       *       - name: mockId
       *         in: path
       *         schema:
       *           type: string
       *         description: mockId
       *         required: true
       *     requestBody:
       *        description: Set mock selected response
       *        content:
       *          application/json:
       *            schema:
       *              type: object
       *              required:
       *                - responseId
       *              properties:
       *                responseId:
       *                  type: string
       *                  description: The id of the sniffer
       *                  example: 121ed1e5-0502-4fd3-a3f0-4603fcca1cbc
       *     responses:
       *       200:
       *         description: Selected response was set
       *       500:
       *         description: Server error
       */
      async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.auth.user.id;
        const { responseId } = req.body;
        const { mockId } = req.params;

        const mock = await this.mockService.setSelectedResponse(
          userId,
          mockId,
          responseId
        );

        res.status(200).send(mock);
      }
    );

    router.route("/:mockId/activate").post(
      /**
       * @openapi
       * /sharkio/mocks/{mockId}/activate:
       *   post:
       *     tags:
       *      - mock
       *     parameters:
       *       - name: mockId
       *         in: path
       *         schema:
       *           type: string
       *         description: mockId
       *         required: true
       *     description: Get a mock
       *     responses:
       *       200:
       *         description: Returns a mock
       *       500:
       *         description: Server error
       */
      async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.auth.user.id;
        const { mockId } = req.params;

        const requests = await this.mockService.setIsActive(
          userId,
          mockId,
          true
        );
        res.status(200).send(requests);
      }
    );

    router.route("/:mockId/deactivate").post(
      /**
       * @openapi
       * /sharkio/mocks/{mockId}/deactivate:
       *   post:
       *     tags:
       *      - mock
       *     parameters:
       *       - name: mockId
       *         in: path
       *         schema:
       *           type: string
       *         description: mockId
       *         required: true
       *     description: Get a mock
       *     responses:
       *       200:
       *         description: Returns a mock
       *       500:
       *         description: Server error
       */
      async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.auth.user.id;
        const limit = +(req.params.limit ?? 1000);
        const { mockId } = req.params;

        const requests = await this.mockService.setIsActive(
          userId,
          mockId,
          false
        );
        res.status(200).send(requests);
      }
    );

    return { router, path: "/sharkio/mocks" };
  }
}
