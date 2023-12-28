import { Mock } from "../../model/entities/Mock";
import { DefaultResponseSelector } from "./default-response-selector";
import { RandomResponseSelector } from "./random-response-selector";
import { SequentialResponseSelector } from "./sequential-response-selector";
import { IMockResponseSelector } from "./response-selectors.type";

export class MockResponseSelector implements IMockResponseSelector {
  private selectionStrategies: Record<string, IMockResponseSelector>;

  constructor() {
    this.selectionStrategies = {
      default: new DefaultResponseSelector(),
      random: new RandomResponseSelector(),
      sequence: new SequentialResponseSelector(),
    };
  }

  async select(mock: Mock) {
    const selectedResponse =
      await this.selectionStrategies[
        mock.responseSelectionMethod ?? "default"
      ].select(mock);

    return selectedResponse;
  }
}
