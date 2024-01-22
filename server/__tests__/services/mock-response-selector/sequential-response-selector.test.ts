import { Mock } from "../../../model/entities/Mock";
import { MockResponse } from "../../../model/entities/MockResponse";
import { SequentialResponseSelector } from "../../../services/mock-response-selector";

const baseMock: Mock = {
  method: "GET",
  url: "/test",
  status: 200,
  body: "",
  createdAt: new Date("2023-12-27T16:40:51.802Z"),
  updatedAt: new Date("2023-12-27T16:40:51.802Z"),
  id: "e07e14fa-fe96-4807-a4a7-86d49f11fbbc",
  snifferId: "02c9d520-e557-4ab7-9fa3-52ae0e8e85b7",
  isActive: true,
  ownerId: "d60ed1e5-0502-4fd3-a3f0-4603fcca1cbc",
  headers: {},
  name: "",
  responseSelectionMethod: "random",
  mockResponses: [],
  selectedResponseId: "1244b884-a97c-4053-8cbf-c965963c5f6f",
  sniffer: undefined,
};

const baseResponseMock: MockResponse = {
  id: "38c3b506-67df-4c5b-9596-1f46c12ea9d2",
  mockId: "e07e14fa-fe96-4807-a4a7-86d49f11fbbc",
  ownerId: "d60ed1e5-0502-4fd3-a3f0-4603fcca1cbc",
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
  let sequentialResponseSelector: SequentialResponseSelector;

  beforeAll(() => {
    sequentialResponseSelector = new SequentialResponseSelector();
  });

  it("no responses", async () => {
    const res = await sequentialResponseSelector.select({
      ...baseMock,
      mockResponses: [],
    });

    expect(res).toBeUndefined();
  });

  it("should select second response when first is selected", async () => {
    const secondResponse = {
      ...baseResponseMock,
      id: "38c3b506-67df-4c5b-9596-1f46c12ea9d3",
      sequenceIndex: 2,
    };
    const res = await sequentialResponseSelector.select({
      ...baseMock,
      mockResponses: [baseResponseMock, secondResponse],
      selectedResponseId: baseResponseMock.id,
    });

    expect(res).toEqual(secondResponse);
  });

  it("Should cycle through entire length", async () => {
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
    const res = await sequentialResponseSelector.select({
      ...baseMock,
      mockResponses: [baseResponseMock, secondResponse, thirdResponse],
      selectedResponseId: thirdResponse.id,
    });

    expect(res).toEqual(baseResponseMock);
  });
});
