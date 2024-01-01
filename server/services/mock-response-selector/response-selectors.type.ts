import { Mock } from "../../model/entities/Mock";
import { MockResponse } from "../../model/entities/MockResponse";

export interface IMockResponseSelector {
  select(mock: Mock): Promise<MockResponse | undefined>;
}

export type SelectionStrategy = "default" | "random" | "sequence" | string;
