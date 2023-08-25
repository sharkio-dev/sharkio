import { Collection } from "./collection.types";

export interface ICollectionPersistency {
  persist(collection: Map<Collection["id"], Collection>): Promise<void>;
  load(): Map<Collection["id"], Collection>;
}
