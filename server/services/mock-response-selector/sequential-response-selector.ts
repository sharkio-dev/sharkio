import { Mock } from "../../model/entities/Mock";
import { IMockResponseSelector } from "./response-selectors.type";

export class SequentialResponseSelector implements IMockResponseSelector {
  constructor() {}
  async select(mock: Mock) {
    if (mock.mockResponses != null && mock.mockResponses.length > 0) {
      const sortedResponses = mock.mockResponses.sort(
        (a, b) => a.sequenceIndex - b.sequenceIndex
      );
      const currentSelectedIndex = sortedResponses.findIndex(
        (response) => response.id === mock.selectedResponseId
      );

      const nextResponse =
        sortedResponses[(currentSelectedIndex + 1) % sortedResponses.length];

      return nextResponse;
    }
  }
}
