import { MockNotFoundError } from "./exceptions";
import { ManagedMock, Mock } from "./mock.types";

type mockId = string;

export default class MockManager {
  constructor(private mocks: Map<mockId, ManagedMock> = new Map()) {}

  async addMock(mock: Mock): Promise<ManagedMock> {
    const managedMock: ManagedMock = {
      ...mock,
      active: false,
      id: `${mock.method} ${mock.endpoint}`,
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
    return this.mocks.get(id);
  }

  getAllMocks() {
    return Array.from(this.mocks.entries());
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
