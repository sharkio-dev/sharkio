import { PrismaClient } from "@prisma/client";
import { v4 } from "uuid";
import { useLog } from "../../log";
import { SnifferConfig } from "../../sniffer/sniffer";
import { ConfigLoader } from "./config-loader-interface";
import { SnifferConfigSetup } from "./file-config.types";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class DbConfig implements ConfigLoader {
  private readonly prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  async getAllUsersSniffers() {
    const sniffers = await this.prismaClient.sniffer.findMany({});

    return sniffers.map(
      (dbConfig) =>
        ({
          ...dbConfig,
          downstreamUrl: dbConfig.downstream_url,
          isStarted: dbConfig.is_started,
        }) as SnifferConfigSetup,
    );
  }

  async getUserSniffers(userId: string) {
    const sniffers = await this.prismaClient.sniffer.findMany({
      where: { user_id: userId },
    });

    return sniffers.map(
      (dbConfig) =>
        ({
          ...dbConfig,
          downstreamUrl: dbConfig.downstream_url,
          isStarted: dbConfig.is_started,
        }) as SnifferConfigSetup,
    );
  }

  async update(
    userId: string,
    existingId: string,
    newConfig: SnifferConfig,
    isStarted: boolean,
  ) {
    try {
      const { downstreamUrl, ...config } = newConfig;
      await this.prismaClient.sniffer.update({
        where: { id: existingId, user_id: userId },
        data: {
          port: newConfig.port,
          name: newConfig.name,
          downstream_url: newConfig.downstreamUrl,
          is_started: isStarted,
          user_id: userId,
        },
      });

      log.info("Updated existing sniffer");
    } catch (error) {
      log.error("Failed to update existing sniffer", error);
      throw error;
    }
  }

  async addSniffer(userId: string, snifferConfig: SnifferConfig) {
    try {
      log.info("Adding new sniffer");
      await this.prismaClient.sniffer.create({
        data: {
          user_id: userId,
          name: snifferConfig.name,
          port: snifferConfig.port,
          id: v4(),
          is_started: false,
          downstream_url: snifferConfig.downstreamUrl,
        },
      });
    } catch (error) {
      log.error(error);
      throw error;
    }
  }

  async removeSniffer(id: string) {
    await this.prismaClient.sniffer.deleteMany({
      where: { id },
    });
  }

  async setIsStarted(id: string, isStarted: boolean) {
    log.info("-----------------------");
    log.info({ id });
    await this.prismaClient.sniffer.update({
      where: { id },
      data: { is_started: isStarted },
    });
  }
}
