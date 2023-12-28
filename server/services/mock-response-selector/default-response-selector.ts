import { Mock } from "../../model/entities/Mock";
import { IMockResponseSelector } from "./response-selectors.type";

export class DefaultResponseSelector implements IMockResponseSelector {
  constructor() {}

  async select(mock: Mock) {
    const selectedResponse = mock.mockResponses.find((mockResponse) => {
      return mockResponse.id === mock.selectedResponseId;
    });

    return selectedResponse;
  }
}
