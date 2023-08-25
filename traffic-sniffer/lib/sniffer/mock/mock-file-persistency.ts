import fs from "fs/promises";
import fsSync from "fs";
import z from "zod";
import { IMockPersistency } from "./mock-storage.interface";
import { Mock } from "./mock.types";

const MockConfigValidator = z.array(
  z.object({
    id: z.string().uuid(),
    method: z.string(),
    endpoint: z.string(),
    status: z.number(),
    data: z.any().optional(),
  }),
);

export class MockFilePersistency implements IMockPersistency {
  constructor(private readonly mockFilePath: string) {}

  async persist(mocks: Map<string, Mock>) {
    this.createFileIfNotExist(this.mockFilePath);
    const data = JSON.stringify(Array.from(mocks.values()), null, 2);
    await this.writeToFile(data);
  }

  load() {
    try {
      const fileData = fsSync.readFileSync(this.mockFilePath, "utf8");
      const parsedData = JSON.parse(fileData);
      const validatedConfig = MockConfigValidator.parse(parsedData);
      const mocks = new Map<string, Mock>();

      validatedConfig.forEach((mock) => {
        mocks.set(mock.id, {
          ...mock,
        });
      });

      return mocks;
    } catch (e) {
      console.error("failed to load mocks data");
      return new Map();
    }
  }

  async createFileIfNotExist(path: string) {
    if (!fsSync.existsSync(path)) {
      fsSync.writeFileSync(path, JSON.stringify({}), { flag: "w" });
    }
  }

  async writeToFile(data: string) {
    await fs.writeFile(this.mockFilePath, data);
  }
}
