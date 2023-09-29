"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("./exceptions");
class MockManager {
    mocks;
    isActive = true;
    constructor(mocks = new Map()) {
        this.mocks = mocks;
    }
    async addMock(mock) {
        const managedMock = {
            ...mock,
            active: true,
            id: `${mock.method} ${mock.endpoint}`,
        };
        this.mocks.set(managedMock.id, managedMock);
        return managedMock;
    }
    changeMockData(id, data) {
        let managedMock = this.mocks.get(id);
        if (managedMock !== undefined) {
            managedMock.data = data;
            this.mocks.set(id, managedMock);
        }
        else {
            throw new exceptions_1.MockNotFoundError();
        }
    }
    updateMock(id, mock) {
        let managedMock = this.mocks.get(id);
        if (managedMock !== undefined) {
            managedMock = {
                ...managedMock,
                ...mock,
            };
            this.mocks.set(id, managedMock);
        }
        else {
            throw new exceptions_1.MockNotFoundError();
        }
    }
    removeMock(id) {
        this.mocks.delete(id);
    }
    getMock(id) {
        return this.mocks.get(id);
    }
    getAllMocks() {
        return Array.from(this.mocks.values());
    }
    activateMock(id) {
        const mock = this.mocks.get(id);
        if (mock !== undefined) {
            mock.active = true;
        }
        else {
            throw new exceptions_1.MockNotFoundError();
        }
    }
    deactivateMock(id) {
        const mock = this.mocks.get(id);
        if (mock !== undefined) {
            mock.active = false;
        }
        else {
            throw new exceptions_1.MockNotFoundError();
        }
    }
    deactivateManager() {
        this.isActive = false;
    }
    activateManager() {
        this.isActive = true;
    }
    getIsActive() {
        return this.isActive;
    }
}
exports.default = MockManager;
