import { v4 } from "uuid";
import {
  Collection,
  CreateCollectionBody,
  UpdateCollectionBody,
} from "./collection.types";

export class CollectionManager {
  private collections: Map<Collection["id"], Collection>;

  constructor() {
    this.collections = new Map();
  }

  get(id: Collection["id"]) {
    return this.collections.get(id);
  }

  getAll() {
    return Array.from(this.collections.values());
  }

  create(collectionCreateBody: CreateCollectionBody) {
    const newCollection = {
      id: v4(),
      ...collectionCreateBody,
    };

    this.collections.set(newCollection.id, newCollection);
  }

  update(collectionUpdateBody: UpdateCollectionBody) {
    const collection = this.collections.get(collectionUpdateBody.id);

    if (!collection) {
      throw new Error("Collection not found");
    }
    const newCollection: Collection = {
      ...collection,
      ...collectionUpdateBody,
    };

    this.collections.set(collectionUpdateBody.id, newCollection);
  }

  remove(id: Collection["id"]) {
    this.collections.delete(id);
  }
}
