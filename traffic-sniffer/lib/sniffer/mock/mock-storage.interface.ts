import { Mock } from "./mock.types";

export interface IMockPersistency {
  persist(collection: Map<Mock["id"], Mock>): Promise<void>;
  load(): Map<Mock["id"], Mock>;
}
