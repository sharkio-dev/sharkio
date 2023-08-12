const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
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
    "./lib/collection-manager/collection-manager-controller.ts",
  ],
};

export const openApiSpecification = swaggerJsdoc(options);
