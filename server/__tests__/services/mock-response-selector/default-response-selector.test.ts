import { Mock } from "../../../model/entities/Mock";
import { MockResponse } from "../../../model/entities/MockResponse";
import { DefaultResponseSelector } from "../../../services/mock-response-selector";

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
  responseSelectionMethod: "random",
  mockResponses: [],
  selectedResponseId: "1244b884-a97c-4053-8cbf-c965963c5f6f",
  user: undefined,
  sniffer: undefined,
};

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

describe("Sequential response selector service", () => {
  let defaultResponseSelector: DefaultResponseSelector;
  let mock: Mock;
  beforeAll(() => {
    defaultResponseSelector = new DefaultResponseSelector();
  });

  it("no responses", async () => {
    const res = await defaultResponseSelector.select({
      ...baseMock,
      mockResponses: [],
    });

    expect(res).toBeUndefined();
  });

  it("Should return selected mock - last ", async () => {
    const secondResponse = {
      ...baseResponseMock,
      id: "38c3b506-67df-4c5b-9596-1f46c12ea9d3",
      sequenceIndex: 2,
    };
    const thirdResponse = {
      ...baseResponseMock,
      id: "38c3b506-67df-4c5b-9596-1f46c12ea9d4",
      sequenceIndex: 3,
    };
    const res = await defaultResponseSelector.select({
      ...baseMock,
      mockResponses: [baseResponseMock, secondResponse, thirdResponse],
      selectedResponseId: thirdResponse.id,
    });

    expect(res).toEqual(thirdResponse);
  });

  it("Should return selected mock - first", async () => {
    const secondResponse = {
      ...baseResponseMock,
      id: "38c3b506-67df-4c5b-9596-1f46c12ea9d3",
      sequenceIndex: 2,
    };
    const thirdResponse = {
      ...baseResponseMock,
      id: "38c3b506-67df-4c5b-9596-1f46c12ea9d4",
      sequenceIndex: 3,
    };
    const res = await defaultResponseSelector.select({
      ...baseMock,
      mockResponses: [baseResponseMock, secondResponse, thirdResponse],
      selectedResponseId: baseResponseMock.id,
    });

    expect(res).toEqual(baseResponseMock);
  });
});
