import { useLog } from "../../lib/log";
import { Mock, MockRepository } from "../../model/mock/mock.model";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});
export class MockService {
  constructor(private readonly mockRepository: MockRepository) {}

  getByUser(userId: any, limit: number) {
    return this.mockRepository.getByUser(userId, limit);
  }

  getIsActive() {
    throw new Error("Method not implemented.");
  }

  getMock(userId: string, snifferId: string, endpoint: string): Promise<Mock> {
    throw new Error("Method not implemented.");
  }
}
