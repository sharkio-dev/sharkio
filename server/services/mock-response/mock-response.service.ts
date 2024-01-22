import { useLog } from "../../lib/log";
import { MockResponse } from "../../model/entities/MockResponse";
import { MockResponseRepository } from "../../model/repositories/mock-response.repository";
import { MockRepository } from "../../model/repositories/mock.repository";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class MockResponseService {
  constructor(
    private readonly mockResponseRepository: MockResponseRepository,
  ) {}

  getByOwnerId(ownerId: string) {
    return this.mockResponseRepository.getByUserId(ownerId);
  }

  getById(ownerId: string, mockResponseId: string) {
    return this.mockResponseRepository.getById(ownerId, mockResponseId);
  }

  deleteById(ownerId: string, mockResponseId: string) {
    return this.mockResponseRepository.deleteById(ownerId, mockResponseId);
  }

  editResponse(
    ownerId: string,
    mockResponseId: string,
    mockResponse: Partial<MockResponse>,
  ) {
    return this.mockResponseRepository.editById(
      ownerId,
      mockResponseId,
      mockResponse,
    );
  }

  async createResponse(
    ownerId: string,
    mockId: string,
    mockResponse: Omit<
      MockResponse,
      "id" | "createdAt" | "updatedAt" | "mockId" | "mock" | "sequenceIndex"
    >,
  ) {
    const createdMock = await this.mockResponseRepository.create(
      ownerId,
      mockId,
      mockResponse,
    );

    return createdMock;
  }

  async createResponses(
    ownerId: string,
    mockId: string,
    mockResponse: Omit<
      MockResponse,
      "id" | "createdAt" | "updatedAt" | "mockId" | "mock" | "sequenceIndex"
    >[],
  ) {
    const createdMock = await this.mockResponseRepository.createMany(
      ownerId,
      mockId,
      mockResponse,
    );

    return createdMock;
  }
}
