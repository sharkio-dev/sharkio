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
    "./controllers/mock-manager-controller.ts",
    "./controller/sniffer-manager-controller.ts",
    "./controller/collection-manager-controller.ts",
  ],
};

export const openApiSpecification = swaggerJsdoc(options);
