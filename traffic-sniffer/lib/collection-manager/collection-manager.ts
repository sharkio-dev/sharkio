import { v4 } from "uuid";
import {
  Collection,
  CreateCollectionBody,
  UpdateCollectionBody,
} from "./collection.types";
import { Invocation } from "../../types";
import { InterceptedRequest } from "../intercepted-request";

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
      requests: [],
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

  addRequest(id: Collection["id"], request: InterceptedRequest) {
    const collection = this.collections.get(id);
    if (collection === undefined) {
      throw new Error("collection not found");
    }
    collection?.requests?.push(request);
    this.collections.set(id, collection);
  }
}
