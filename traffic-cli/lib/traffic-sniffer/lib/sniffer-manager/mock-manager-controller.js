"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockManagerController = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const log_1 = require("../log");
const request_validator_1 = require("../request-validator");
const general_validators_1 = require("../request-validator/general-validators");
const exceptions_1 = require("../sniffer/mock/exceptions");
const log = (0, log_1.useLog)({
    dirname: __dirname,
    filename: __filename,
});
class MockManagerController {
    snifferManager;
    baseUrl;
    constructor(snifferManager, baseUrl = "/sharkio/sniffer") {
        this.snifferManager = snifferManager;
        this.baseUrl = baseUrl;
    }
    setup(app) {
        const router = (0, express_1.Router)();
        /**
         * @openapi
         * /sharkio/sniffer/action/getMocks:
         *   get:
         *     tags:
         *       - mock
         *     description: Get all mocks
         *     responses:
         *       200:
         *         description: Returns all mocks
         *       500:
         *         description: Server error
         */
        router.get("/action/getMocks", async (req, res, next) => {
            try {
                const mocks = this.snifferManager.getAllMocks();
                res.json(mocks).status(200);
            }
            catch (e) {
                log.error("An unexpected error occured", {
                    method: "GET",
                    path: `${this.baseUrl}/action/getMocks`,
                    error: e,
                });
                res.sendStatus(500);
            }
        });
        /**
         * @openapi
         * /sharkio/sniffer/:port/mock:
         *   get:
         *     tags:
         *       - mock
         *     description: Get a mock
         *     parameters:
         *       - name: port
         *         in: query
         *         schema:
         *           type: integer
         *           minimum: 0
         *           example: 8080
         *         description: service port
         *         required: true
         *     responses:
         *       200:
         *         description: Returns a mock
         *       404:
         *         description: Mock not found
         *       500:
         *         description: Server error
         */
        router.get("/:port/mock", (0, request_validator_1.requestValidator)({
            params: zod_1.z.object({
                port: general_validators_1.portValidator,
            }),
        }), async (req, res, next) => {
            try {
                const { port } = req.params;
                const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));
                if (sniffer !== undefined) {
                    const mocks = sniffer.getMockManager().getAllMocks();
                    return res.send(mocks).status(200);
                }
                else {
                    return res.sendStatus(404);
                }
            }
            catch (e) {
                log.error("An unexpected error occured", {
                    method: "GET",
                    path: `${this.baseUrl}/:port/mock`,
                    error: e,
                });
                return res.sendStatus(500);
            }
        });
        /**
         * @openapi
         * /sharkio/sniffer/:port/mock:
         *   post:
         *     tags:
         *       - mock
         *     description: Create a mock
         *     parameters:
         *       - name: port
         *         in: query
         *         schema:
         *           type: integer
         *           minimum: 0
         *           example: 8080
         *         description: service port
         *         required: true
         *     requestBody:
         *        description: Create a new mock
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                method:
         *                  type: string
         *                  description: An HTTP method
         *                  enum: [GET, POST, UPDATE, DELETE, PUT ]
         *                  example: POST
         *                body:
         *                  description: The request payload
         *                  example: { someKey: "someValue" }
         *                endpoint:
         *                  type: string
         *                  description: The request URL
         *                  example: www.google.com
         *                status:
         *                  type: integer
         *                  description: An HTTP status code
         *                  example: 200
         *     responses:
         *       201:
         *         description: Mock created
         *       409:
         *         description: Mock already exists
         *       500:
         *         description: Server error
         */
        router.post("/:port/mock", (0, request_validator_1.requestValidator)({
            params: zod_1.z.object({
                port: general_validators_1.portValidator,
            }),
            body: zod_1.z.object({
                method: zod_1.z.string().nonempty(),
                endpoint: zod_1.z.string().nonempty(),
                data: zod_1.z.any(),
                status: zod_1.z.coerce.number().positive(),
            }),
        }), async (req, res, next) => {
            try {
                const { port } = req.params;
                const mock = req.body;
                const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));
                if (sniffer !== undefined) {
                    const { id } = await sniffer.getMockManager().addMock(mock);
                    return res.send(id).status(201);
                }
                else {
                    return res.sendStatus(409);
                }
            }
            catch (e) {
                log.error("An unexpected error occured", {
                    method: "POST",
                    path: `${this.baseUrl}/:port/mock`,
                    error: e,
                });
                return res.sendStatus(500);
            }
        });
        /**
         * @openapi
         * /sharkio/sniffer/:port/mock:
         *  put:
         *    tags:
         *      - mock
         *    description: Updated a mock
         *    parameters:
         *       - name: port
         *         in: query
         *         schema:
         *           type: integer
         *           minimum: 0
         *           example: 8080
         *         description: service port
         *         required: true
         *    requestBody:
         *        description: Updated mock
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                mockId:
         *                  type: string
         *                  description: The id of the mock we reference
         *                  example: 6bd539be-4d3d-4101-bc99-64628640a86b
         *                method:
         *                  type: string
         *                  description: An HTTP method
         *                  enum: [GET, POST, UPDATE, DELETE, PUT ]
         *                  example: POST
         *                body:
         *                  description: The request payload
         *                  example: { someKey: "someValue" }
         *                endpoint:
         *                  type: string
         *                  description: The request URL
         *                  example: www.google.com
         *                status:
         *                  type: integer
         *                  description: An HTTP status code
         *                  example: 200
         */
        router.put("/:port/mock", (0, request_validator_1.requestValidator)({
            params: zod_1.z.object({
                port: general_validators_1.portValidator,
            }),
            body: zod_1.z.object({
                mockId: zod_1.z.string().nonempty(),
                method: zod_1.z.string().nonempty(),
                endpoint: zod_1.z.string().nonempty(),
                data: zod_1.z.any(),
                status: zod_1.z.coerce.number().positive(),
            }),
        }), async (req, res, next) => {
            try {
                const { port } = req.params;
                const { mockId, ...mock } = req.body;
                const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));
                if (sniffer !== undefined) {
                    sniffer.getMockManager().updateMock(mockId, mock);
                    return res.sendStatus(200);
                }
                else {
                    return res.sendStatus(404);
                }
            }
            catch (e) {
                log.error("An unexpected error occured", {
                    method: "PUT",
                    path: `${this.baseUrl}/:port/mock`,
                    error: e,
                });
                return res.sendStatus(500);
            }
        });
        /**
         * @openapi
         * /sharkio/sniffer/:port/mock:
         *   delete:
         *     tags:
         *       - mock
         *     description: Delete a mock
         *     parameters:
         *       - name: port
         *         in: query
         *         schema:
         *           type: integer
         *           minimum: 0
         *           example: 8080
         *         description: service port
         *         required: true
         *     requestBody:
         *        description: Create a new mock
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                mockId:
         *                  type: string
         *                  description: The id of the mock we reference
         *                  example: 6bd539be-4d3d-4101-bc99-64628640a86b
         *     responses:
         *       200:
         *         description: Mock deleted
         *       404:
         *         description: Mock not found
         *       500:
         *         description: Server error
         */
        router.delete("/:port/mock", (0, request_validator_1.requestValidator)({
            params: zod_1.z.object({
                port: general_validators_1.portValidator,
            }),
            body: zod_1.z.object({
                mockId: zod_1.z.string().nonempty(),
            }),
        }), async (req, res, next) => {
            try {
                const { port } = req.params;
                const { mockId } = req.body;
                const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));
                if (sniffer !== undefined) {
                    sniffer.getMockManager().removeMock(mockId);
                    return res.sendStatus(200);
                }
                else {
                    return res.sendStatus(404);
                }
            }
            catch (e) {
                log.error("An unexpected error occured", {
                    method: "DELETE",
                    path: `${this.baseUrl}/:port/mock`,
                    error: e,
                });
                return res.sendStatus(500);
            }
        });
        /**
         * @openapi
         * /sharkio/sniffer/:port/mock/manager/actions/activate:
         *   post:
         *     tags:
         *       - mock
         *     description: Activate mock manager
         *     parameters:
         *       - name: port
         *         in: query
         *         schema:
         *           type: integer
         *           minimum: 0
         *           example: 8080
         *         description: service port
         *         required: true
         *     responses:
         *        200:
         *          description: Mock has been activated for the service
         *        404:
         *          description: Mock not found
         *        500:
         *          description: Server error
         */
        router.post("/:port/mock/manager/actions/activate", (0, request_validator_1.requestValidator)({
            params: zod_1.z.object({
                port: general_validators_1.portValidator,
            }),
        }), async (req, res, next) => {
            try {
                const { port } = req.params;
                const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));
                if (sniffer !== undefined) {
                    sniffer.getMockManager().deactivateManager();
                    return res.sendStatus(200);
                }
                else {
                    return res.sendStatus(404);
                }
            }
            catch (e) {
                log.error("An unexpected error occured", {
                    method: "POST",
                    path: `${this.baseUrl}/:port/mock/manager/actions/activate`,
                    error: e,
                });
                return res.sendStatus(500);
            }
        });
        /**
         * @openapi
         * /sharkio/sniffer/:port/mock/manager/actions/deactivate:
         *   post:
         *     tags:
         *       - mock
         *     description: Deactivate mock manager
         *     parameters:
         *       - name: port
         *         in: query
         *         schema:
         *           type: integer
         *           minimum: 0
         *           example: 8080
         *         description: service port
         *         required: true
         *     responses:
         *       200:
         *         description: Mock has been deactivated for the service
         *       404:
         *         description: Mock not found
         *       500:
         *         description: Server error
         */
        router.post("/:port/mock/manager/actions/deactivate", (0, request_validator_1.requestValidator)({
            params: zod_1.z.object({
                port: general_validators_1.portValidator,
            }),
        }), async (req, res, next) => {
            try {
                const { port } = req.params;
                const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));
                if (sniffer !== undefined) {
                    sniffer.getMockManager().deactivateManager();
                    return res.sendStatus(200);
                }
                else {
                    return res.sendStatus(404);
                }
            }
            catch (e) {
                log.error("An unexpected error occured", {
                    method: "POST",
                    path: `${this.baseUrl}/:port/mock/manager/actions/deactivate`,
                    error: e,
                });
                return res.sendStatus(500);
            }
        });
        /**
         * @openapi
         * /sharkio/sniffer/:port/mock/actions/activate:
         *   post:
         *     tags:
         *       - mock
         *     description: Activate a mock
         *     parameters:
         *       - name: port
         *         in: query
         *         schema:
         *           type: integer
         *           minimum: 0
         *           example: 8080
         *         description: service port
         *         required: true
         *     requestBody:
         *        description: Activate a mock
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                mockId:
         *                  type: string
         *                  description: The id of the mock we reference
         *                  example: 6bd539be-4d3d-4101-bc99-64628640a86b
         *     responses:
         *       200:
         *         description: Mock activated
         *       404:
         *         description: Mock not found
         *       500:
         *         description: Server error
         */
        router.post("/:port/mock/actions/activate", (0, request_validator_1.requestValidator)({
            params: zod_1.z.object({
                port: general_validators_1.portValidator,
            }),
            body: zod_1.z.object({
                mockId: zod_1.z.string().nonempty(),
            }),
        }), async (req, res, next) => {
            try {
                const { port } = req.params;
                const { mockId } = req.body;
                const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));
                if (sniffer !== undefined) {
                    sniffer.getMockManager().activateMock(mockId);
                    return res.sendStatus(200);
                }
                else {
                    return res.sendStatus(404);
                }
            }
            catch (e) {
                switch (true) {
                    case e instanceof exceptions_1.MockNotFoundError: {
                        return res.sendStatus(404);
                    }
                    default: {
                        log.error("An unexpected error occured", {
                            method: "POST",
                            path: `${this.baseUrl}/:port/mock/actions/activate`,
                            error: e,
                        });
                        return res.sendStatus(500);
                    }
                }
            }
        });
        /**
         * @openapi
         * /sharkio/sniffer/:port/mock/actions/deactivate:
         *   post:
         *     tags:
         *       - mock
         *     description: Deactivate a mock
         *     parameters:
         *       - name: port
         *         in: query
         *         schema:
         *           type: integer
         *           minimum: 0
         *           example: 8080
         *         description: service port
         *         required: true
         *     requestBody:
         *        description: Deactivate a mock
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                mockId:
         *                  type: string
         *                  description: The id of the mock we reference
         *                  example: 6bd539be-4d3d-4101-bc99-64628640a86b
         *     responses:
         *       200:
         *         description: Mock deactivated
         *       404:
         *         description: Mock not found
         *       500:
         *         description: Server error
         */
        router.post("/:port/mock/actions/deactivate", (0, request_validator_1.requestValidator)({
            params: zod_1.z.object({
                port: general_validators_1.portValidator,
            }),
            body: zod_1.z.object({
                mockId: zod_1.z.string().nonempty(),
            }),
        }), async (req, res, next) => {
            try {
                const { port } = req.params;
                const { mockId } = req.body;
                const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));
                if (sniffer !== undefined) {
                    sniffer.getMockManager().deactivateMock(mockId);
                    return res.sendStatus(200);
                }
                else {
                    return res.sendStatus(404);
                }
            }
            catch (e) {
                log.error("An unexpected error occured", {
                    method: "POST",
                    path: `${this.baseUrl}/:port/mock/actions/deactivate`,
                    error: e,
                });
                return res.sendStatus(500);
            }
        });
        app.use(this.baseUrl, router);
    }
}
exports.MockManagerController = MockManagerController;
