import { Mock } from "../../../model/entities/Mock";
import { MockResponse } from "../../../model/entities/MockResponse";
import { Sniffer } from "../../../model/entities/Sniffer";
import { Interceptor } from "../../../server/interceptors/Interceptor";
import MockMiddleware from "../../../server/middlewares/mock.middleware";
import { MockResponseSelector } from "../../../services/mock-response-selector";
import { MockResponseTransformer } from "../../../services/mock-response-transformer/mock-response-transformer";
import { MockService } from "../../../services/mock/mock.service";
import ResponseService from "../../../services/response/response.service";
import { SnifferService } from "../../../services/sniffer/sniffer.service";

const defaultSelectedSniffer: Sniffer = {
  ownerId: "1234",
  id: "1111",
  name: null,
  createdAt: new Date(),
  updatedAt: null,
  downstreamUrl: "",
  subdomain: "",
  port: 0,
  endpoints: [],
  mocks: [],
  requests: [],
  responses: [],
  user: undefined,
  tests: [],
  mockResponses: [],
};

const defaultReq = {
  url: "/test",
  method: "GET",
  hostname: "test-hostname-xa7pc.localhost.com:8080/test",
};

const baseResponseHeaders = {
  "test-header": "test-value",
  "test-header-2": "test-value-2",
};

const baseResponseMock: MockResponse = {
  id: "38c3b506-67df-4c5b-9596-1f46c12ea9d2",
  mockId: "e07e14fa-fe96-4807-a4a7-86d49f11fbbc",
  ownerId: "d60ed1e5-0502-4fd3-a3f0-4603fcca1cbc",
  snifferId: "02c9d520-e557-4ab7-9fa3-52ae0e8e85b7",
  status: 200,
  body: "",
  headers: baseResponseHeaders,
  name: "example-mock-name",
  createdAt: new Date("2023-12-27T18:08:58.769Z"),
  updatedAt: new Date("2023-12-27T18:08:58.769Z"),
  sequenceIndex: 1,
};

const baseMock: Mock = {
  method: "GET",
  url: "/test",
  status: 200,
  body: "body",
  createdAt: new Date("2023-12-27T16:40:51.802Z"),
  updatedAt: new Date("2023-12-27T16:40:51.802Z"),
  id: "e07e14fa-fe96-4807-a4a7-86d49f11fbbc",
  snifferId: "02c9d520-e557-4ab7-9fa3-52ae0e8e85b7",
  isActive: true,
  ownerId: "d60ed1e5-0502-4fd3-a3f0-4603fcca1cbc",
  headers: {},
  name: "",
  responseSelectionMethod: "asdfasdf",
  selectedResponseId: baseResponseMock.id,
  mockResponses: [baseResponseMock],
};

describe("MockMiddleware", () => {
  let defaultResponseService: Partial<ResponseService>;
  let defaultInterceptorService: Partial<Interceptor>;

  beforeAll(() => {
    defaultInterceptorService = {
      findSnifferBySubdomain: async () => {
        return Promise.resolve(null);
      },
      findMockByUrl: async () => {
        return Promise.resolve(null);
      },
    };

    defaultResponseService = {};
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("sniffer not found - mock not found - should be undefined", async () => {
    const mockMiddleware = new MockMiddleware(
      defaultInterceptorService as Interceptor,
      new MockResponseSelector({}),
      new MockResponseTransformer(),
    );

    const mock = await mockMiddleware.findMock(
      "test-hostname-xa7pc.localhost.com",
      "/test",
      "GET",
    );

    expect(mock).toBeUndefined();
  });

  it("sniffer found - mock not found - should be undefined", async () => {
    const findBySubdomain = jest.fn();
    findBySubdomain.mockResolvedValue(defaultSelectedSniffer);

    defaultInterceptorService.findSnifferBySubdomain = findBySubdomain;

    const mockMiddleware = new MockMiddleware(
      defaultInterceptorService as Interceptor,
      new MockResponseSelector({}),
      new MockResponseTransformer(),
    );

    const mock = await mockMiddleware.findMock(
      "test-hostname-xa7pc.localhost.com",
      "/test",
      "GET",
    );

    expect(mock).toBeUndefined();
  });

  it("sniffer found - mock found inactive - mock should be defined", async () => {
    const findBySubdomain = jest.fn();
    findBySubdomain.mockResolvedValue(defaultSelectedSniffer);

    const mockMiddleware = new MockMiddleware(
      defaultInterceptorService as Interceptor,
      new MockResponseSelector({}),
      new MockResponseTransformer(),
    );

    const mock = await mockMiddleware.findMock(
      "test-hostname-xa7pc.localhost.com",
      "/test",
      "GET",
    );

    expect(mock).toBeUndefined();
  });

  it("sniffer found - mock found active - mock should be defined", async () => {
    const findBySubdomain = jest.fn();
    findBySubdomain.mockResolvedValue(defaultSelectedSniffer);

    const snifferService = {
      findBySubdomain,
    };

    const inactiveMock = { ...baseMock, isActive: false };

    const mockService = {
      getByUrl: async () => {
        return inactiveMock;
      },
    };

    const mockMiddleware = new MockMiddleware(
      defaultInterceptorService as Interceptor,
      new MockResponseSelector({}),
      new MockResponseTransformer(),
    );

    const mock = await mockMiddleware.findMock(
      "test-hostname-xa7pc.localhost.com",
      "/test",
      "GET",
    );

    expect(mock).toBeUndefined();
  });

  it("sniffer found - mock found active - response found - should respond default response", async () => {
    const setHeader = jest.fn();
    const status = jest.fn().mockReturnThis();
    const send = jest.fn();

    /* setup */
    const mockReq = {
      hostname: "example.com",
      url: "/test-url",
      method: "GET",
    };
    const mockRes = {
      name: "test-response",
      setHeader,
      status,
      send,
    };
    const nextFunction = jest.fn();

    const mockMiddleware = new MockMiddleware(
      defaultInterceptorService as Interceptor,
      new MockResponseSelector({}),
      new MockResponseTransformer(),
    );

    mockMiddleware.findMock = jest.fn().mockResolvedValue(baseMock);
    mockMiddleware.interceptMockResponse = jest.fn();
    mockMiddleware.updateSelectedResponse = jest.fn();

    /* execute */
    await mockMiddleware.mock(mockReq as any, mockRes as any, nextFunction);

    /* assertions */

    // assert status
    expect(status).toHaveBeenCalledWith(200);

    // assert body
    expect(send).toHaveBeenCalledWith(baseResponseMock.body);

    // assert headers
    expect(setHeader).toHaveBeenCalledWith(
      Object.keys(baseResponseHeaders)[0],
      Object.values(baseResponseHeaders)[0],
    );
    expect(setHeader).toHaveBeenCalledWith(
      Object.keys(baseResponseHeaders)[1],
      Object.values(baseResponseHeaders)[1],
    );

    // assert update functions
    expect(mockMiddleware.interceptMockResponse).toHaveBeenCalled();
    expect(mockMiddleware.updateSelectedResponse).toHaveBeenCalled();
  });

  it("sniffer found - mock not found - should call next", async () => {
    const setHeader = jest.fn();
    const status = jest.fn().mockReturnThis();
    const send = jest.fn();

    /* setup */
    const mockReq = {
      hostname: "example.com",
      url: "/test-url",
      method: "GET",
    };
    const mockRes = {
      name: "test-response",
      setHeader,
      status,
      send,
    };
    const nextFunction = jest.fn();

    const mockMiddleware = new MockMiddleware(
      defaultInterceptorService as Interceptor,
      new MockResponseSelector({}),
      new MockResponseTransformer(),
    );

    mockMiddleware.findMock = jest.fn().mockResolvedValue(undefined);
    mockMiddleware.interceptMockResponse = jest.fn();
    mockMiddleware.updateSelectedResponse = jest.fn();

    /* execute */
    await mockMiddleware.mock(mockReq as any, mockRes as any, nextFunction);

    /* assertions */
    expect(status).toHaveBeenCalledTimes(0);
    expect(send).toHaveBeenCalledTimes(0);
    expect(nextFunction).toHaveBeenCalled();
  });
});
