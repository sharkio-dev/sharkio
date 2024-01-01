import { MockResponse } from "../../../model/entities/MockResponse";
import { MockResponseTransformer } from "../../../services/mock-response-transformer/mock-response-transformer";

describe("MockResponseTransformer", () => {
  it("test transform body and headers", () => {
    const transformer = new MockResponseTransformer();
    const body = { test: "this is a test string" };

    const mockResponse: MockResponse = {
      headers: { hello: "{{body.test}}" },
      body: '{ "hello": "world {{body.test}}" }',
      id: "",
      status: 0,
      name: null,
      snifferId: "",
      userId: "",
      mockId: "",
      sequenceIndex: 0,
      createdAt: new Date(),
      updatedAt: null,
    };

    const res = transformer.transform(mockResponse, {
      body,
      headers: {},
      url: "",
      method: "",
      query: {},
      params: {},
    });

    expect(res.body).toEqual('{ "hello": "world this is a test string" }');
    expect(res.headers?.hello).toEqual(body.test);
  });

  it("test transform body and headers - parameter doesn't exist", () => {
    const transformer = new MockResponseTransformer();
    const body = { test: "this is a test string" };

    const mockResponse: MockResponse = {
      headers: { hello: "{{body.test1}}" },
      body: '{ "hello": "world {{body.test1}}" }',
      id: "",
      status: 0,
      name: null,
      snifferId: "",
      userId: "",
      mockId: "",
      sequenceIndex: 0,
      createdAt: new Date(),
      updatedAt: null,
    };

    const res = transformer.transform(mockResponse, {
      body,
      headers: {},
      url: "",
      method: "",
      query: {},
      params: {},
    });

    expect(res.body).toEqual('{ "hello": "world " }');
    expect(res.headers?.hello).toEqual("");
  });

  it("test transform body and headers - undefined context", () => {
    const transformer = new MockResponseTransformer();
    const body = { test: "this is a test string" };

    const mockResponse: MockResponse = {
      headers: { hello: "{{body.test}}" },
      body: '{ "hello": "world {{body.test}}" }',
      id: "",
      status: 0,
      name: null,
      snifferId: "",
      userId: "",
      mockId: "",
      sequenceIndex: 0,
      createdAt: new Date(),
      updatedAt: null,
    };

    const res = transformer.transform(mockResponse, undefined);

    expect(res.body).toEqual('{ "hello": "world " }');
    expect(res.headers?.hello).toEqual("");
  });
});
