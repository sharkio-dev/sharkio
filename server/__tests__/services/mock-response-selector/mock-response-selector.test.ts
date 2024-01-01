import { Mock } from "../../../model/entities/Mock";
import { MockResponse } from "../../../model/entities/MockResponse";
import { MockResponseSelector } from "../../../services/mock-response-selector";
import { IMockResponseSelector } from "../../../services/mock-response-selector/response-selectors.type";

const baseResponseMock: MockResponse = {
  id: "38c3b506-67df-4c5b-9596-1f46c12ea9d2",
  mockId: "e07e14fa-fe96-4807-a4a7-86d49f11fbbc",
  userId: "d60ed1e5-0502-4fd3-a3f0-4603fcca1cbc",
  snifferId: "02c9d520-e557-4ab7-9fa3-52ae0e8e85b7",
  status: 200,
  body: "",
  headers: {},
  name: "example-mock-name",
  createdAt: new Date("2023-12-27T18:08:58.769Z"),
  updatedAt: new Date("2023-12-27T18:08:58.769Z"),
  sequenceIndex: 1,
};

const baseMock = {
  method: "GET",
  url: "/test",
  status: 200,
  body: "",
  createdAt: new Date("2023-12-27T16:40:51.802Z"),
  updatedAt: new Date("2023-12-27T16:40:51.802Z"),
  id: "e07e14fa-fe96-4807-a4a7-86d49f11fbbc",
  snifferId: "02c9d520-e557-4ab7-9fa3-52ae0e8e85b7",
  isActive: true,
  userId: "d60ed1e5-0502-4fd3-a3f0-4603fcca1cbc",
  headers: {},
  name: "",
  responseSelectionMethod: "asdfasdf",
  selectedResponseId: baseResponseMock.id,
  mockResponses: [baseResponseMock],
};

describe("MockResponseSelector", () => {
  it("unknown strategy - should select default strategy", async () => {
    let mockResponseSelector: MockResponseSelector = new MockResponseSelector(
      {},
    );

    const selectedResponse = await mockResponseSelector.select(baseMock);

    expect(selectedResponse).toEqual(baseResponseMock);
  });

  it("should choose correct strategy", async () => {
    const mock: Mock = {
      ...baseMock,
      responseSelectionMethod: "test",
    };
    const testResponseName = "testttt";

    let mockResponseSelector: MockResponseSelector = new MockResponseSelector({
      test: {
        select: async (mock: Mock) => {
          const mockResponse: MockResponse = {
            ...baseResponseMock,
            name: testResponseName,
          };
          return mockResponse;
        },
      },
    });

    const res = await mockResponseSelector.select(mock);
    expect(res).toBeDefined();
    expect(res?.name).toEqual(testResponseName);
  });
});
