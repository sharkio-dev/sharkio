import { Invocation } from "../../types";

export type CreateCollectionBody = {
  name: string;
};

export type UpdateCollectionBody = {
  id: string;
  name?: string;
};

export type Collection = {
  id: string;
  name: string;
  invocations?: Invocation[];
};
