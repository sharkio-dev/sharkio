import { useLog } from "../../lib/log";
import { Mock, MockRepository } from "../../model/mock/mock.model";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});
export class MockService {
  constructor(private readonly mockRepository: MockRepository) {}

  getById(userId: string, mockId: string) {
    return this.mockRepository.getById(userId, mockId);
  }

  getByUser(userId: string, limit: number) {
    return this.mockRepository.getByUser(userId, limit);
  }

  async create(
    userId: string,
    url: string,
    method: string,
    body: string,
    headers: string,
    status: number,
    name: string,
    snifferId: string
  ) {
    const createdMock = await this.mockRepository.repository.create({
      url,
      method,
      body,
      headers,
      status,
      userId,
      name,
      snifferId,
    });

    return this.mockRepository.repository.save(createdMock);
  }

  async update(
    userId: string,
    mockId: string,
    url?: string,
    method?: string,
    body?: string,
    headers?: string,
    status?: number,
    name?: string,
    snifferId?: string
  ) {
    return this.mockRepository.repository
      .createQueryBuilder()
      .update()
      .where("id = :mockId AND userId = :userId", { mockId, userId })
      .set({
        id: mockId,
        userId,
        url,
        method,
        body,
        headers,
        status,
        name,
        snifferId,
      })
      .returning("*")
      .execute();
  }

  delete(userId: string, mockId: string) {
    return this.mockRepository.deleteById(userId, mockId);
  }

  setIsActive() {
    throw new Error("Method not implemented.");
  }

  getIsActive() {
    throw new Error("Method not implemented.");
  }

  getMock(userId: string, snifferId: string, endpoint: string): Promise<Mock> {
    throw new Error("Method not implemented.");
  }
}
