import { Mock } from "../../model/entities/Mock";
import { MockResponse } from "../../model/entities/MockResponse";
import { IMockResponseSelector } from "./response-selectors.type";

export class RandomResponseSelector implements IMockResponseSelector {
  async select(mock: Mock): Promise<MockResponse | undefined> {
    const randomIndex = Math.floor(Math.random() * mock.mockResponses.length);

    return mock.mockResponses[randomIndex];
  }
}
