import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiSpecification } from "../../swagger";

export class SwaggerUiController {
  constructor() {}
  setup(app: Express) {
    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(openApiSpecification)
    );
    app.use("/openapi.json", (req, res, next) => {
      res.send(JSON.stringify(openApiSpecification, null, 2));
    });
  }
}
