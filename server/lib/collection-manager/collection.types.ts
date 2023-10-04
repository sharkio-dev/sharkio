import { Invocation } from "../../types";
import { InterceptedRequest } from "../intercepted-request";

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
  requests?: InterceptedRequest[];
};
