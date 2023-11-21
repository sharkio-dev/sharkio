import {
  Collection,
  InterceptedRequest,
  SnifferCreateConfig,
} from "../types/types";
import { BackendAxios } from "./backendAxios";
import { SnifferType } from "../stores/sniffersStores";
import { InvocationType } from "../pages/sniffers/types";

export const createSniffer = (config: Omit<SnifferCreateConfig, "id">) => {
  return BackendAxios.post("/sniffer", config);
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

export const activateMock = (
  port: number,
  method: string,
  endpoint: string,
) => {
  return BackendAxios.post(`/sniffer/${port}/mock/actions/activate`, {
    mockId: `${method} ${endpoint}`,
  });
};

export const deactivateMock = (
  port: number,
  method: string,
  endpoint: string,
) => {
  return BackendAxios.post(`/sniffer/${port}/mock/actions/deactivate`, {
    mockId: `${method} ${endpoint}`,
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
  return BackendAxios.get(`/invocation`);
};
export const executeInvocation = (
  invocation: InvocationType & { testId?: string },
) => {
  const url = invocation.url;
  const method = invocation.method;
  const headers = invocation.headers;
  const body = invocation.body;

  return BackendAxios.post("/request/execute", {
    snifferId: invocation.snifferId,
    url,
    method,
    headers,
    body,
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


