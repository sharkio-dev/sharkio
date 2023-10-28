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
    "./controllers/sniffer.controller.ts",
    "./controllers/collection-manager-controller.ts",
    "./controllers/auth-controller.ts",
    "./controllers/request.controller.ts",
  ],
};

export const openApiSpecification = swaggerJsdoc(options);
