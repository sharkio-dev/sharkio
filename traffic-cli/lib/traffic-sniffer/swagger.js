"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openApiSpecification = void 0;
const swaggerJsdoc = require("swagger-jsdoc");
const options = {
    failOnErrors: true,
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sharkio",
            version: "1.0.0",
        },
    },
    apis: [
        "./lib/sniffer-manager/mock-manager-controller.ts",
        "./lib/sniffer-manager/sniffer-manager-controller.ts",
    ],
};
exports.openApiSpecification = swaggerJsdoc(options);
