import fs from "fs";
import path from "path";
import { useLog } from "../../lib/log";
import { MockRepository } from "../../model/repositories/mock.repository";
import { SnifferRepository } from "../../model/repositories/sniffers.repository";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class FileConfigWriterService {
  private readonly globalOutputDir: string | null;

  constructor(
    private readonly mockRepository: MockRepository,
    private readonly snifferRepository: SnifferRepository,
    globalOutputDir?: string,
  ) {
    this.globalOutputDir =
      globalOutputDir ?? process.env.MOCK_CONFIG_OUTPUT_DIR ?? null;
  }

  isEnabled(): boolean {
    return this.globalOutputDir !== null;
  }

  async writeForSniffer(ownerId: string, snifferId: string): Promise<void> {
    const sniffer = await this.snifferRepository.getById(ownerId, snifferId);
    const outputDir = sniffer?.fileConfigOutputDir ?? this.globalOutputDir;
    if (!outputDir) return;

    const mocks = await this.mockRepository.getBySnifferId(ownerId, snifferId);

    const config = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      snifferId,
      mocks: mocks.map((mock) => ({
        id: mock.id,
        name: mock.name,
        method: mock.method,
        url: mock.url,
        isActive: mock.isActive,
        responseSelectionMethod: mock.responseSelectionMethod ?? "default",
        selectedResponseId: mock.selectedResponseId,
        responses: (mock.mockResponses ?? [])
          .sort((a, b) => (a.sequenceIndex ?? 0) - (b.sequenceIndex ?? 0))
          .map((r) => ({
            id: r.id,
            name: r.name,
            status: r.status,
            body: r.body,
            headers: r.headers ?? {},
            delay: r.delay ?? 0,
            sequenceIndex: r.sequenceIndex ?? 0,
          })),
      })),
    };

    const filePath = path.join(outputDir, "sharkio_middleware_config.json");
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf-8");
    log.info(`Mock config written to ${filePath}`);
  }
}
