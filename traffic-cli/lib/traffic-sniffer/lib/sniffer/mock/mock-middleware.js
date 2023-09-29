"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MockMiddleware {
    mockManager;
    constructor(mockManager) {
        this.mockManager = mockManager;
    }
    mock(req, res, next) {
        const mock = this.mockManager.getMock(`${req.method} ${req.url}`);
        if (this.mockManager.getIsActive() &&
            mock !== undefined &&
            mock.active === true) {
            res.status(mock.status).send(mock.data);
        }
        else {
            next();
        }
    }
}
exports.default = MockMiddleware;
