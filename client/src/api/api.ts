import {
  Collection,
  InterceptedRequest,
  SnifferCreateConfig,
} from "../types/types";
import { BackendAxios } from "./backendAxios";
import { SnifferType } from "../stores/sniffersStores";
import { Mock } from "../stores/mockStore";

export const createSniffer = (config: Omit<SnifferCreateConfig, "id">) => {
  return BackendAxios.post("/sniffer", config).then((res) => {
    return res.data;
  });
};

export const getSniffers = () => {
  return BackendAxios.get<SnifferType[]>("/sniffer");
};

export const getSniffer = (port: number) => {
  return BackendAxios.get(`/sniffer/${port}`);
};

export const stopSniffer = (id: string) => {
  return BackendAxios.post(`/sniffer/${id}/actions/stop`);
};

export const startSniffer = async (id: string) => {
  return await BackendAxios.post(`/sniffer/${id}/actions/start`);
};

export const deleteSniffer = async (id: string) => {
  return await BackendAxios.delete(`/sniffer/${id}`);
};

export const editSniffer = async (
  newConfig: Partial<Omit<SnifferType, "subdomain">>,
) => {
  return BackendAxios.put(`/sniffer/${newConfig.id}`, newConfig);
};

export const getRequests = () => {
  return BackendAxios.get("/request");
};

export const importRequestFromCurl = (
  snifferId: string,
  curlCommand: string,
) => {
  return BackendAxios.post("/request/import/curl", {
    snifferId,
    curl: curlCommand,
  });
};

export const importRequestFromSwagger = (
  snifferId: string,
  swagger: string,
) => {
  return BackendAxios.post(`/request/import/${snifferId}/swagger`, swagger);
};
export const getAllMocks = () => {
  return BackendAxios.get("/sniffer/action/getMocks");
};

export const createMock = (
  snifferId: string,
  method: string,
  endpoint: string,
  status: number,
  data: any,
) => {
  return BackendAxios.post(`/sniffer/${snifferId}/mock`, {
    sniffer_id: snifferId,
    method,
    endpoint,
    data,
    status,
  });
};

export const editMock = (
  id: string,
  port: number,
  method: string,
  endpoint: string,
  status: number,
  data: any,
) => {
  return BackendAxios.put(`/sniffer/${port}/mock`, {
    mockId: id,
    method,
    endpoint,
    data,
    status,
  });
};

export const deleteMock = (id: string, sniffer_id: string) => {
  return BackendAxios.delete(`/sniffer/${sniffer_id}/mock`, {
    data: { mockId: id },
  });
};

export const getCollections = () => {
  return BackendAxios.get("/collection");
};

export const createCollection = (name: string) => {
  return (
    BackendAxios.post("/collection", { name }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const saveRequestToCollection = (
  id: Collection["id"],
  request: InterceptedRequest,
) => {
  return BackendAxios.post(`/collection/${id}/request`, { request });
};

export const getInvocation = (invocationId: string) => {
  return BackendAxios.get(`/invocation/${invocationId}`).then((res) => {
    return res.data;
  });
};

export const getInvocations = (requestId: string) => {
  return BackendAxios.get(`/request/${requestId}/invocation`).then((res) => {
    return res.data;
  });
};

export const getEnpoints = (snifferId: string) => {
  return BackendAxios.get(`/sniffer/${snifferId}/request`).then((res) => {
    return res.data;
  });
};

export const getLiveInvocations = () => {
  return BackendAxios.get(`/invocation`).then((res) => {
    return res.data;
  });
};
export const executeInvocationAPI = (invocation: {
  testId?: string;
  snifferId: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
}) => {
  const { url, method, headers, body } = invocation;

  return BackendAxios.post("/request/execute", {
    snifferId: invocation.snifferId,
    url,
    method,
    headers,
    body,
  }).then((res) => {
    return res.data;
  });
};

export const loadChat = (chatId: string) => {
  return BackendAxios.get(`/chat/${chatId}`);
};

export const newChat = (content: string) => {
  return BackendAxios.post(`/chat`, { content });
};

export const newMessage = (chatId: string, content: string) => {
  return BackendAxios.post(`/chat/${chatId}/message`, { content });
};

export const getMocksAPI = (snifferId: string) => {
  return BackendAxios.get(`/sniffer/${snifferId}/mocks`);
};

export const activateMockAPI = (mockId: string) => {
  return BackendAxios.post(`/mocks/${mockId}/activate`);
};

export const deactivateMockAPI = (mockId: string) => {
  return BackendAxios.post(`/mocks/${mockId}/deactivate`);
};

export const deleteMockAPI = (mockId: string) => {
  return BackendAxios.delete(`/mocks/${mockId}`);
};

export const createMockAPI = (
  mock: Omit<Mock, "id"> & { snifferId: string },
) => {
  return BackendAxios.post(`/mocks`, mock).then((res) => {
    return res.data;
  });
};

export const editMockAPI = (
  mockId: string,
  mock: Partial<Omit<Mock, "id">>,
) => {
  return BackendAxios.patch(`/mocks/${mockId}`, mock);
};
