"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAlreadyExists = exports.MockNotFoundError = void 0;
class MockNotFoundError extends Error {
}
exports.MockNotFoundError = MockNotFoundError;
class MockAlreadyExists extends Error {
}
exports.MockAlreadyExists = MockAlreadyExists;
