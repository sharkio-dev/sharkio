"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliSnifferManagerController = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const request_validator_1 = require("../../../traffic-sniffer/lib/request-validator");
const general_validators_1 = require("../../../traffic-sniffer/lib/request-validator/general-validators");
const log_1 = require("../../../traffic-sniffer/lib/log");
const log = (0, log_1.useLog)({
    dirname: __dirname,
    filename: __filename,
});
class CliSnifferManagerController {
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
         * /sharkio/sniffer/invocation:
         *   get:
         *     tags:
         *      - sniffer
         *     description: Get all request invocation
         *     responses:
         *       200:
         *         description: Returns all invocations
         *       500:
         *         description: Server error
         */
        router.get("/invocation", (req, res) => {
            try {
                res.status(200).send(this.snifferManager.stats());
            }
            catch (e) {
                log.error("An unexpected error occured", {
                    method: "GET",
                    path: `${this.baseUrl}/invocation`,
                    error: e,
                });
                res.sendStatus(500);
            }
        });
        /**
         * @openapi
         * /sharkio/sniffer:
         *   get:
         *     tags:
         *      - sniffer
         *     description: Get all sniffers
         *     responses:
         *       200:
         *         description: Returns all sniffers
         *       500:
         *         description: Server error
         */
        router.get("", (req, res) => {
            return res.status(200).send(this.snifferManager.getAllSniffers().map((sniffer) => {
                const { config, isStarted } = sniffer.stats();
                return {
                    config,
                    isStarted,
                };
            }));
        });
        /**
         * @openapi
         * /sharkio/sniffer/:port:
         *   get:
         *     tags:
         *      - sniffer
         *     description: Get a sniffers
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
         *         description: Returns a sniffer
         *       404:
         *         description: Sniffer not found
         *       500:
         *         description: Server error
         */
        router.get("/:port", (0, request_validator_1.requestValidator)({
            params: zod_1.z.object({
                port: general_validators_1.portValidator,
            }),
        }), (req, res) => {
            try {
                const { port } = req.params;
                const sniffer = this.snifferManager.getSniffer(+port);
                if (sniffer !== undefined) {
                    return res.send(sniffer.stats()).status(200);
                }
                else {
                    return res.sendStatus(404);
                }
            }
            catch (e) {
                log.error("An unexpected error occured", {
                    method: "GET",
                    path: `${this.baseUrl}/:port`,
                    error: e,
                });
                return res.sendStatus(500);
            }
        });
        /**
         * @openapi
         * /sharkio/sniffer:
         *   post:
         *     tags:
         *      - sniffer
         *     description: Create a sniffer
         *     requestBody:
         *        description: Create a sniffer
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              required:
         *                - name
         *                - port
         *                - downstreamUrl
         *                - id
         *              properties:
         *                name:
         *                  type: string
         *                  descirption: The name of the sniffer
         *                  example: google sniffer
         *                port:
         *                  type: number
         *                  description: The port on the sniffer will intercept on
         *                  minimum: 0
         *                  example: 8080
         *                downstreamUrl:
         *                  type: string
         *                  description: The URL the sniffer will delegate the request to
         *                  example: www.google.com
         *                id:
         *                  type: string
         *                  description: The identity of the sniffer
         *                  example: 6bd539be-4d3d-4101-bc99-64628640a86b
         *     responses:
         *       201:
         *         description: Sniffer created
         *       500:
         *         description: Server error
         */
        router.post("", (0, request_validator_1.requestValidator)({
            body: zod_1.z.object({
                name: zod_1.z.string().nonempty(),
                port: general_validators_1.portValidator,
                downstreamUrl: zod_1.z.string().nonempty(),
                id: zod_1.z.string().nonempty(),
            }),
        }), (req, res) => {
            try {
                const config = req.body;
                this.snifferManager.createSniffer(config);
                return res.sendStatus(201);
            }
            catch (e) {
                log.error("An unexpected error occured", {
                    method: "POST",
                    path: `${this.baseUrl}/:port`,
                    error: e,
                });
                return res.sendStatus(500);
            }
        });
        /**
         * @openapi
         * /sharkio/sniffer/:port/actions/stop:
         *   post:
         *     tags:
         *      - sniffer
         *     description: Stop a sniffer
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
         *         description: Sniffer stopped
         *       404:
         *         description: Sniffer not found
         *       500:
         *         description: Server error
         */
        router.post("/:port/actions/stop", (0, request_validator_1.requestValidator)({
            params: zod_1.z.object({
                port: general_validators_1.portValidator,
            }),
        }), (req, res) => {
            try {
                const { port } = req.params;
                const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));
                if (sniffer !== undefined) {
                    sniffer.stop();
                    this.snifferManager.setSnifferConfigToStarted(sniffer.getId(), false);
                    return res.sendStatus(200);
                }
                else {
                    return res.sendStatus(404);
                }
            }
            catch (e) {
                log.error("An unexpected error occured", {
                    method: "POST",
                    path: `${this.baseUrl}/:port/actions/stop`,
                    error: e,
                });
                return res.sendStatus(500);
            }
        });
        /**
         * @openapi
         * /sharkio/sniffer/:port/actions/start:
         *   post:
         *     tags:
         *      - sniffer
         *     description: Start a sniffer
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
         *         description: Sniffer started
         *       404:
         *         description: Sniffer not found
         *       500:
         *         description: Server error
         */
        router.post("/:port/actions/start", (0, request_validator_1.requestValidator)({
            params: zod_1.z.object({
                port: general_validators_1.portValidator,
            }),
        }), async (req, res) => {
            try {
                const { port } = req.params;
                const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));
                if (sniffer) {
                    await sniffer.start();
                    this.snifferManager.setSnifferConfigToStarted(sniffer.getId(), true);
                    return res.sendStatus(200);
                }
                else {
                    return res.sendStatus(404);
                }
            }
            catch (e) {
                log.error("An unexpected error occured", {
                    method: "POST",
                    path: `${this.baseUrl}/:port/actions/start`,
                    error: e,
                });
                return res.sendStatus(500);
            }
        });
        /**
         * @openapi
         * /sharkio/sniffer/:port/actions/execute:
         *   post:
         *     tags:
         *      - sniffer
         *     description: Execute a request from a sniffer
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
         *        description: Execute a request from a sniffer
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                url:
         *                  type: string
         *                  example: www.google.com
         *                method:
         *                  type: string
         *                  description: Http status
         *                  example: GET
         *                  enum: [GET, POST, UPDATE, DELETE, PUT]
         *                invocation:
         *                  type: object
         *                  properties:
         *                    id:
         *                      type: string
         *                    timestamp:
         *                      type: string
         *                    body:
         *                      description: The invocation body content
         *                    headers:
         *                      type: object
         *                      properties:
         *                        key:
         *                          type: string
         *                          example: value
         *                    cookies:
         *                      type: object
         *                      properties:
         *                        key:
         *                          type: string
         *                          example: value
         *                    params:
         *                      type: object
         *                      properties:
         *                        key:
         *                          type: string
         *                          example: value
         *
         *     responses:
         *       200:
         *         description: Request executed
         *       404:
         *         description: Sniffer not found
         *       500:
         *         description: Server error
         */
        router.post("/:port/actions/execute", (0, request_validator_1.requestValidator)({
            params: zod_1.z.object({
                port: general_validators_1.portValidator,
            }),
            body: zod_1.z.object({
                url: zod_1.z.string().url(),
                method: zod_1.z
                    .string()
                    .toLowerCase()
                    .pipe(zod_1.z.enum(["get", "post", "delete", "patch", "put"])),
                invocation: zod_1.z.object({
                    id: zod_1.z.string().nonempty(),
                    timestamp: zod_1.z.coerce.date(),
                    body: zod_1.z.any().optional(),
                    headers: zod_1.z.any().optional(),
                    cookies: zod_1.z.any().optional(),
                    params: zod_1.z.any().optional(),
                }),
            }),
        }), async (req, res) => {
            try {
                const { port } = req.params;
                const { url, method, invocation } = req.body;
                const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));
                if (sniffer !== undefined) {
                    await sniffer.execute(url, method, invocation).catch((e) => log.error("Error while executing", {
                        method: "POST",
                        path: `${this.baseUrl}/:port/actions/execute`,
                        error: e,
                    }));
                    return res.sendStatus(200);
                }
                else {
                    return res.sendStatus(404);
                }
            }
            catch (e) {
                log.error("An unexpected error occured", {
                    method: "POST",
                    path: `${this.baseUrl}/:port/actions/execute`,
                    error: e,
                });
                return res.sendStatus(500);
            }
        });
        /**
         * @openapi
         * /sharkio/sniffer/:port:
         *   delete:
         *     tags:
         *      - sniffer
         *     description: Delete a sniffer
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
         *         description: Sniffer deleted
         *       404:
         *         description: Sniffer not found
         *       500:
         *         description: Server error
         */
        router.delete("/:port", (0, request_validator_1.requestValidator)({
            params: zod_1.z.object({
                port: general_validators_1.portValidator,
            }),
        }), async (req, res) => {
            try {
                const { port } = req.params;
                const sniffer = this.snifferManager.getSniffer(Number.parseInt(port));
                if (sniffer !== undefined) {
                    this.snifferManager.removeSniffer(Number.parseInt(port));
                    return res.sendStatus(200);
                }
                else {
                    return res.sendStatus(404);
                }
            }
            catch (e) {
                log.error("An unexpected error occured", {
                    method: "DELETE",
                    path: `${this.baseUrl}/:port`,
                    error: e,
                });
                return res.sendStatus(500);
            }
        });
        /**
         * @openapi
         * /sharkio/sniffer/:existingId:
         *   put:
         *     tags:
         *      - sniffer
         *     description: Edit a sniffer
         *     parameters:
         *       - name: existingId
         *         in: query
         *         schema:
         *           type: string
         *           example: 6bd539be-4d3d-4101-bc99-64628640a86b
         *         description: service id
         *         required: true
         *     requestBody:
         *        description: Edit a sniffer
         *        content:
         *          application/json:
         *            schema:
         *              type: object
         *              properties:
         *                port:
         *                  type: integer
         *                  minimum: 0
         *                  example: 8080
         *     responses:
         *       200:
         *         description: Sniffer edited
         *       403:
         *         description: The port already has an allocated sniffer
         *       404:
         *         description: Sniffer not found
         *       500:
         *         description: Server error
         */
        router.put("/:existingId", (0, request_validator_1.requestValidator)({
            params: zod_1.z.object({
                existingId: zod_1.z.string().nonempty(),
            }),
            body: zod_1.z.object({
                port: general_validators_1.portValidator,
            }),
        }), async (req, res) => {
            try {
                const { existingId } = req.params;
                const { port } = req.body;
                const sniffer = this.snifferManager.getSnifferById(existingId);
                // verify that there is no sniffer with the port you want to change to.
                const isPortAlreadyExists = this.snifferManager.getSnifferById(port.toString());
                if ((sniffer !== undefined && !isPortAlreadyExists) ||
                    port === +existingId) {
                    await this.snifferManager.editSniffer(existingId, req.body);
                    return res.sendStatus(200);
                }
                else if (!sniffer) {
                    return res.sendStatus(404);
                }
                else if (isPortAlreadyExists) {
                    return res.sendStatus(403);
                }
            }
            catch (e) {
                log.error("An unexpected error occured", {
                    method: "PUT",
                    path: `${this.baseUrl}/:existingId`,
                    error: e,
                });
                return res.sendStatus(500);
            }
        });
        app.use(this.baseUrl, router);
    }
}
exports.CliSnifferManagerController = CliSnifferManagerController;
