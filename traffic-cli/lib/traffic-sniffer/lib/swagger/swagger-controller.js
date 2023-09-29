"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerUiController = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("../../swagger");
class SwaggerUiController {
    constructor() { }
    setup(app) {
        app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.openApiSpecification));
        app.use("/openapi.json", (req, res, next) => {
            res.send(JSON.stringify(swagger_1.openApiSpecification, null, 2));
        });
    }
}
exports.SwaggerUiController = SwaggerUiController;
