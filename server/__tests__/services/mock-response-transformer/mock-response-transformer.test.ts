import { MockResponse } from "../../../model/entities/MockResponse";
import { RequestTransformer } from "../../../services/request-transformer/request-transformer";

describe("RequestTransformer", () => {
  it("test transform body and headers", () => {
    const transformer = new RequestTransformer();
    const body = { test: "this is a test string" };

    const mockResponse: MockResponse = {
      headers: { hello: "{{body.test}}" },
      body: '{ "hello": "world {{body.test}}" }',
      id: "",
      status: 0,
      name: null,
      snifferId: "",
      ownerId: "",
      mockId: "",
      sequenceIndex: 0,
      createdAt: new Date(),
      updatedAt: null,
    };

    const res = transformer.transformResponse(mockResponse, {
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
    const transformer = new RequestTransformer();
    const body = { test: "this is a test string" };

    const mockResponse: MockResponse = {
      headers: { hello: "{{body.test1}}" },
      body: '{ "hello": "world {{body.test1}}" }',
      id: "",
      status: 0,
      name: null,
      snifferId: "",
      ownerId: "",
      mockId: "",
      sequenceIndex: 0,
      createdAt: new Date(),
      updatedAt: null,
    };

    const res = transformer.transformResponse(mockResponse, {
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
    const transformer = new RequestTransformer();
    const body = { test: "this is a test string" };

    const mockResponse: MockResponse = {
      headers: { hello: "{{body.test}}" },
      body: '{ "hello": "world {{body.test}}" }',
      id: "",
      status: 0,
      name: null,
      snifferId: "",
      ownerId: "",
      mockId: "",
      sequenceIndex: 0,
      createdAt: new Date(),
      updatedAt: null,
    };

    const res = transformer.transformResponse(mockResponse, undefined);

    expect(res.body).toEqual('{ "hello": "world " }');
    expect(res.headers?.hello).toEqual("");
  });

  it("test transform body and headers - repeat with trailing comma", () => {
    const transformer = new RequestTransformer();
    const body = { test: "this is a test string" };

    const mockResponse: MockResponse = {
      headers: {},
      body: '[{{#repeat 2}}{ "hello": "world {{body.test}}" }{{#compare @index "<" 2}},{{/compare}}{{/repeat}}]',
      id: "",
      status: 0,
      name: null,
      snifferId: "",
      ownerId: "",
      mockId: "",
      sequenceIndex: 0,
      createdAt: new Date(),
      updatedAt: null,
    };

    const res = transformer.transformResponse(mockResponse, undefined);

    expect(res.body).toEqual('[{ "hello": "world " },{ "hello": "world " }]');
  });

  it("test transform body and headers - repeat from query param", () => {
    const transformer = new RequestTransformer();
    const body = { test: "this is a test string" };

    const mockResponse: MockResponse = {
      headers: {},
      body: '[{{#repeat query.items}}{ "hello": "world {{body.test}}" }{{#compare @index "<" 2}},{{/compare}}{{/repeat}}]',
      id: "",
      status: 0,
      name: null,
      snifferId: "",
      ownerId: "",
      mockId: "",
      sequenceIndex: 0,
      createdAt: new Date(),
      updatedAt: null,
    };

    const res = transformer.transformResponse(mockResponse, {
      query: { items: 2 },
    } as unknown as any);

    expect(res.body).toEqual('[{ "hello": "world " },{ "hello": "world " }]');
  });

  it("test transform body and headers - nested repeat from query param", () => {
    const transformer = new RequestTransformer();
    const body = { test: "this is a test string" };

    const mockResponse: MockResponse = {
      headers: {},
      body: `[{{#repeat query.items}}{{#repeat ../query.items}}{ "hello": "world {{body.test}}" }{{#compare @index "<" 2}},{{/compare}}{{/repeat}}{{#compare @index "<" 2}},{{/compare}}{{/repeat}}]`,
      id: "",
      status: 0,
      name: null,
      snifferId: "",
      ownerId: "",
      mockId: "",
      sequenceIndex: 0,
      createdAt: new Date(),
      updatedAt: null,
    };

    const res = transformer.transformResponse(mockResponse, {
      query: { items: 2 },
    } as unknown as any);

    expect(res.body).toEqual(
      '[{ "hello": "world " },{ "hello": "world " },{ "hello": "world " },{ "hello": "world " }]'
    );
  });

  it("test transform - error should return transformation error", () => {
    const transformer = new RequestTransformer();
    const body = { test: "this is a test string" };

    const mockResponse: MockResponse = {
      headers: {},
      body: '[{{#repeat query.items}{ "hello": "world {{body.test}}" }{{#compare @index "<" 2}},{{/compare}}{{/repeat}}]',
      id: "",
      status: 0,
      name: null,
      snifferId: "",
      ownerId: "",
      mockId: "",
      sequenceIndex: 0,
      createdAt: new Date(),
      updatedAt: null,
    };

    const res = transformer.transformResponse(mockResponse, {
      query: { items: 2 },
    } as unknown as any);

    expect(res.body).toEqual("transformation error");
  });
});
