import { useLog } from "../../lib/log";
import { MockResponse } from "../../model/entities/MockResponse";
import { MockResponseRepository } from "../../model/repositories/mock-response.repository";
import { MockRepository } from "../../model/repositories/mock.repository";
import { FileConfigWriterService } from "../file-config-writer/file-config-writer.service";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class MockResponseService {
  constructor(
    private readonly mockResponseRepository: MockResponseRepository,
    private readonly configWriter?: FileConfigWriterService,
  ) {}

  getByOwnerId(ownerId: string) {
    return this.mockResponseRepository.getByUserId(ownerId);
  }

  getById(ownerId: string, mockResponseId: string) {
    return this.mockResponseRepository.getById(ownerId, mockResponseId);
  }

  async deleteById(ownerId: string, mockResponseId: string) {
    const existing = await this.mockResponseRepository.getById(
      ownerId,
      mockResponseId,
    );
    const result = await this.mockResponseRepository.deleteById(
      ownerId,
      mockResponseId,
    );
    if (existing?.snifferId) {
      await this.configWriter?.writeForSniffer(ownerId, existing.snifferId);
    }
    return result;
  }

  async editResponse(
    ownerId: string,
    mockResponseId: string,
    mockResponse: Partial<MockResponse>,
  ) {
    const result = await this.mockResponseRepository.editById(
      ownerId,
      mockResponseId,
      mockResponse,
    );
    const existing = await this.mockResponseRepository.getById(
      ownerId,
      mockResponseId,
    );
    if (existing?.snifferId) {
      await this.configWriter?.writeForSniffer(ownerId, existing.snifferId);
    }
    return result;
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
    if (mockResponse.snifferId) {
      await this.configWriter?.writeForSniffer(ownerId, mockResponse.snifferId);
    }
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
