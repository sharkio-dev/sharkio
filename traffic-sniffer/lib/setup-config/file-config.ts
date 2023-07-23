import fsSync from "fs";
import fs from "fs/promises";
import { ZodError } from "zod";
import { SnifferConfig } from "../sniffer/sniffer";
import { ConfigLoader } from "./config-loader-interface";
import {
  SnifferConfigSetup,
  sniffersConfigValidator,
} from "./file-config.types";
import { useLog } from "../log";

const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export class FileConfig implements ConfigLoader {
  configData: SnifferConfigSetup[];
  path: string;

  constructor(path: string) {
    this.configData = [];
    this.path = path;
  }

  getConfig() {
    this.createFileIfNotExist(this.path);
    this.configData = this.readSetupFileData(this.path);

    console.info("Loaded config from file");
    return this.configData;
  }

  update(existingId: string, newConfig: SnifferConfig, isStarted: boolean) {
    const foundIndex = this.configData.findIndex(
      (item) => item.id === existingId
    );
    if (foundIndex === -1) {
      throw new Error("item was not found");
    }
    this.configData[foundIndex] = this.createSnifferSetup(newConfig, isStarted);
    this.writeToSetupFile();
  }

  async createFileIfNotExist(path: string) {
    if (!fsSync.existsSync(path)) {
      fsSync.writeFileSync(path, JSON.stringify([]), { flag: "w" });
    }
  }

  readSetupFileData(path: string): SnifferConfigSetup[] {
    try {
      const fileData = fsSync.readFileSync(path, "utf8");
      const parsedData = JSON.parse(fileData);
      sniffersConfigValidator.parse(parsedData);

      return parsedData as SnifferConfigSetup[];
    } catch (e) {
      if (e instanceof ZodError) {
        console.warn("Config file is not valid");
        console.debug(e);
      } else {
        console.warn("failed to load config file");
      }

      this.path = this.path.split(".json")[0] + "-temp" + ".json";
      log.error(`Using a temporary config file`, {
        path,
      });

      return [];
    }
  }

  addSniffer(snifferConfig: SnifferConfig) {
    const addedObj = this.createSnifferSetup(snifferConfig, false);
    const isListed = this.configData.findIndex(
      (item) => item.id === snifferConfig.id
    );

    if (isListed !== -1) {
      log.info("Sniffer already listed");
      return;
    }
    this.configData.push(addedObj);
    this.writeToSetupFile();
  }

  removeSniffer(port: number) {
    const foundIndex = this.configData.findIndex((item) => item.port === port);
    if (foundIndex === -1) {
      throw new Error("item was not found");
    }
    this.configData.splice(foundIndex, 1);
    this.writeToSetupFile();
  }

  setIsStarted(snifferId: string, isStarted: boolean) {
    const foundIndex = this.configData.findIndex(
      (item) => item.id === snifferId
    );
    if (foundIndex === -1) {
      throw new Error("item was not found");
    }
    const updatedSetup = this.configData[foundIndex];
    updatedSetup.isStarted = isStarted;
    this.configData[foundIndex] = updatedSetup;
    this.writeToSetupFile();
  }

  async writeToSetupFile() {
    await fs.writeFile(this.path, JSON.stringify(this.configData, null, 2));
  }

  createSnifferSetup(
    snifferConfig: SnifferConfig,
    isStarted: boolean
  ): SnifferConfigSetup {
    return {
      id: snifferConfig.id,
      name: snifferConfig.name,
      downstreamUrl: snifferConfig.downstreamUrl,
      port: snifferConfig.port,
      isStarted: isStarted,
    };
  }
}
