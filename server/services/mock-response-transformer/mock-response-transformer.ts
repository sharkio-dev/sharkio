import { MockResponse } from "./../../model/entities/MockResponse";
import HandleBars from "handlebars";

export class MockResponseTransformer {
  transform(
    response: MockResponse,
    context?: {
      body: any;
      headers: any;
      url: string;
      method: string;
      params: any;
      query: any;
    },
  ) {
    const body = HandleBars.compile(response.body)(context);
    const headers = JSON.parse(
      HandleBars.compile(JSON.stringify(response.headers))(context),
    ) as MockResponse["headers"];

    return { ...response, body, headers };
  }
}
