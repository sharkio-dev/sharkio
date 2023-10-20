import { MockNotFoundError } from "./exceptions";
import { ManagedMock, Mock } from "./mock.types";
import { MockModel } from "../../../model/mock/mock.model";

type mockId = string;

export default class MockManager {
  private isActive: boolean = true;
  private mockModel: MockModel;

  constructor(private mocks: Map<mockId, ManagedMock> = new Map()) {
    this.mockModel = new MockModel();
  }

  async addMock(userId: string, mock: Mock): Promise<ManagedMock> {
    const managedMock: ManagedMock = {
      ...mock,
      active: true,
      id: `${mock.method} ${mock.endpoint}`,
    };

    await this.mockModel.create(userId, managedMock);

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

  async updateMock(id: string, mock: Mock) {
    let managedMock = await this.mockModel.findById(id);

    if (managedMock !== undefined) {
      managedMock = {
        ...managedMock,
        ...mock,
      };
      await this.mockModel.update(id, managedMock);
    } else {
      throw new MockNotFoundError();
    }
  }

  async removeMock(id: string) {
    await this.mockModel.delete(id);
  }

  async getMock(id: string) {
    return await this.mockModel.findById(id);
  }

  async getAllMocks(userId: string) {
    return this.mockModel.findAll(userId);
  }
  async getMockBySnifferId(id: string) {
    return await this.mockModel.findByQuery({ sniffer_id: id });
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
