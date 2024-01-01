import { DefaultResponseSelector } from ".";
import { Mock } from "../../model/entities/Mock";
import {
  IMockResponseSelector,
  SelectionStrategy,
} from "./response-selectors.type";

export class MockResponseSelector implements IMockResponseSelector {
  constructor(
    private readonly selectionStrategies: Record<
      SelectionStrategy,
      IMockResponseSelector
    >,
  ) {
    if (this.selectionStrategies.default == null) {
      this.selectionStrategies.default = new DefaultResponseSelector();
    }
  }

  async select(mock: Mock) {
    const selectionMethod = Object.keys(this.selectionStrategies).includes(
      mock.responseSelectionMethod,
    )
      ? mock.responseSelectionMethod
      : "default";

    const selectedResponse =
      await this.selectionStrategies[selectionMethod].select(mock);

    return selectedResponse;
  }
}
