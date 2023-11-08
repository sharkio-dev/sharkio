import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import {
  Collection,
  InterceptedRequest,
  Invocation,
  SnifferCreateConfig,
} from "../types/types";
import { BackendAxios } from "./backendAxios";
import { Sniffer } from "../stores/sniffersStores";

export const setAuthCookie = (
  event: AuthChangeEvent,
  session: Session | null,
) => {
  return BackendAxios.post("/sharkio/api/auth", { event, session });
};

export const createSniffer = (config: Omit<SnifferCreateConfig, "id">) => {
  return BackendAxios.post("/sniffer", config);
};

export const getSniffers = () => {
  return BackendAxios.get<Sniffer[]>("/sniffer");
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
  newConfig: Partial<Omit<Sniffer, "subdomain">>,
) => {
  return BackendAxios.put(`/sniffer/${newConfig.id}`, newConfig);
};

export const getRequests = () => {
  return BackendAxios.get("/request");
};

export const executeRequest = (
  port: number,
  url: string,
  method: string,
  invocation: Invocation,
) => {
  return BackendAxios.post(`/sniffer/${port}/actions/execute`, {
    url,
    method,
    invocation,
  });
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
  return BackendAxios.get(`/request/${requestId}/invocation`);
};

export const getEnpoints = (snifferId: string) => {
  return BackendAxios.get(`/sniffer/${snifferId}/request`);
};
