"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestValidator = void 0;
const zod_1 = require("zod");
const log_1 = require("../log");
const log = (0, log_1.useLog)({
    dirname: __dirname,
    filename: __filename,
});
const requestValidator = (validations) => (req, res, next) => {
    try {
        validations.params?.parse(req.params);
        validations.body?.parse(req.body);
        return next();
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            const { errors } = e;
            return res.status(400).send(errors);
        }
        else {
            log.error("An unexpected error occured", {
                method: req.method,
                path: req.path,
                error: e,
            });
            return res.sendStatus(500);
        }
    }
};
exports.requestValidator = requestValidator;
