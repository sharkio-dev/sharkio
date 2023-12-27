import { DataSource, Repository } from "typeorm";
import { MockResponse } from "../entities/MockResponse";

export class MockResponseRepository {
  repository: Repository<MockResponse>;

  constructor(private readonly appDataSource: DataSource) {
    this.repository = appDataSource.manager.getRepository(MockResponse);
  }

  getByUserId(userId: string) {
    return this.repository.find({
      where: {
        userId,
      },
    });
  }
  getByMockId(userId: string, snifferId: string) {
    return this.repository.find({
      where: { userId, snifferId },
      order: { createdAt: "DESC" },
    });
  }

  getById(userId: string, mockResponseId: string) {
    return this.repository.findOne({
      where: { userId: userId, id: mockResponseId },
    });
  }

  deleteById(userId: string, mockResponseId: string) {
    return this.repository.delete({ id: mockResponseId, userId });
  }

  editById(mockResponseId: string, mockResponse: Partial<MockResponse>) {
    return this.repository.update(
      {
        id: mockResponseId,
      },
      mockResponse,
    );
  }

  create(
    userId: string,
    mockId: string,
    mockResponse: Omit<
      MockResponse,
      "id" | "createdAt" | "updatedAt" | "mockId" | "mock"
    >,
  ) {
    const createdResponse = this.repository.create({
      ...mockResponse,
      userId,
      mockId,
    });
    return this.repository.save(createdResponse);
  }
}
