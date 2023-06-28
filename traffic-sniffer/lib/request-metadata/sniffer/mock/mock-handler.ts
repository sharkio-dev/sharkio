import { v4 } from "uuid";
import { ManagedMock, Mock } from "./mock-types";
import { MockNotFoundError } from './exceptions';

type ID = string;
export class MockManager {
    constructor(
        private mocks: Map<ID, ManagedMock> = new Map()
    ) { }

    async addMock(mock: Mock): Promise<ManagedMock> {
        const managedMock: ManagedMock = {
            ...mock,
            active: false,
            id: v4()
        };

        this.mocks.set(managedMock.id, managedMock);

        return managedMock;
    }

    changeMockData(id: string, data: Mock["data"]) {
        let managedMock = this.mocks.get(id);

        if (managedMock !== undefined) {
            managedMock.data = data;
            this.mocks.set(id, managedMock);
        } else {
            throw new MockNotFoundError();
        }
    }

    removeMock(id: string) {
        this.mocks.delete(id);
    }

    getMock(id: string) {
        const mock = this.mocks.get(id);

        if (mock !== undefined) {
            return mock;
        }
        else {
            throw new MockNotFoundError();
        }
    }

    getAllMocks() {
        return this.mocks;
    }

    activateMock(id: string) {
        const mock = this.mocks.get(id);

        if (mock !== undefined) {
            mock.active = true;
        } else {
            throw new MockNotFoundError();
        }
    }

    deactivateMock(id: string) {
        const mock = this.mocks.get(id);

        if (mock !== undefined) {
            mock.active = false;
        } else {
            throw new MockNotFoundError();
        }
    }
}