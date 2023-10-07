import { ICollectionPersistency } from "./collection-storage.interface";
import { Collection } from "./collection.types";
import fs from "fs/promises";
import fsSync from "fs";
import z from "zod";

const CollectionConfigValidator = z.array(
  z.object({ id: z.string().uuid(), name: z.string(), requests: z.any() }),
);

export class CollectionFilePersistency implements ICollectionPersistency {
  constructor(private readonly collectionFilePath: string) {}

  async persist(collection: Map<string, Collection>) {
    this.createFileIfNotExist(this.collectionFilePath);
    const data = JSON.stringify(Array.from(collection.values()), null, 2);
    await this.writeToFile(data);
  }

  load() {
    try {
      const fileData = fsSync.readFileSync(this.collectionFilePath, "utf8");
      const parsedData = JSON.parse(fileData);
      const validatedConfig = CollectionConfigValidator.parse(parsedData);
      const collectionsMap = new Map<string, Collection>();

      validatedConfig.forEach((collection) => {
        collectionsMap.set(collection.id, {
          id: collection.id,
          name: collection.name,
          requests: collection.requests,
        });
      });

      return collectionsMap;
    } catch (e) {
      console.error("failed to load collections data");
      return new Map();
    }
  }

  async createFileIfNotExist(path: string) {
    if (!fsSync.existsSync(path)) {
      fsSync.writeFileSync(path, JSON.stringify({}), { flag: "w" });
    }
  }

  async writeToFile(data: string) {
    await fs.writeFile(this.collectionFilePath, data);
  }
}
