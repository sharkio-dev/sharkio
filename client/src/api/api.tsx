import axios from "axios";
import {
  Collection,
  InterceptedRequest,
  Invocation,
  Sniffer,
  SnifferCreateConfig,
} from "../types/types";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

export const setAuthCookie = (
  event: AuthChangeEvent,
  session: Session | null,
) => {
  return fetch("/sharkio/api/auth", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify({ event, session }),
  });
};

export const createSniffer = (userId: string, config: SnifferCreateConfig) => {
  return axios.post("/sharkio/sniffer", JSON.stringify({ userId, ...config }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getSniffers = (userId: string) => {
  return axios.get<Sniffer[]>("/sharkio/sniffer");
};

export const getSniffer = (port: number) => {
  return axios.get(`/sharkio/sniffer/${port}`);
};

export const stopSniffer = (id: string) => {
  return axios.post(`/sharkio/sniffer/${id}/actions/stop`);
};

export const startSniffer = async (id: string) => {
  return await axios.post(`/sharkio/sniffer/${id}/actions/start`);
};

export const deleteSniffer = async (port: number) => {
  return await axios.delete(`/sharkio/sniffer/${port}`);
};

export const editSniffer = async (
  userId: string,
  newConfig: SnifferCreateConfig,
) => {
  return axios.put(
    `/sharkio/sniffer/${newConfig.id}`,
    JSON.stringify({ userId, ...newConfig }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const getRequests = () => {
  return axios.get("/sharkio/sniffer/invocation");
};

export const executeRequest = (
  port: number,
  url: string,
  method: string,
  invocation: Invocation,
) => {
  return axios.post(
    `/sharkio/sniffer/${port}/actions/execute`,
    JSON.stringify({ url, method, invocation }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const getAllMocks = (userId: string) => {
  return axios.get("/sharkio/sniffer/action/getMocks");
};

export const createMock = (
  userId: string,
  id: string,
  method: string,
  endpoint: string,
  status: number,
  data: any,
) => {
  return axios.post(
    `/sharkio/sniffer/${id}/mock`,
    JSON.stringify({ method, endpoint, data, status, userId }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const editMock = (
  id: string,
  port: number,
  method: string,
  endpoint: string,
  status: number,
  data: any,
) => {
  return axios.put(
    `/sharkio/sniffer/${port}/mock`,
    JSON.stringify({ mockId: id, method, endpoint, data, status }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const deleteMock = (id: string, port: number) => {
  return axios.delete(`/sharkio/sniffer/${port}/mock`, {
    data: { mockId: id },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const activateMock = (
  port: number,
  method: string,
  endpoint: string,
) => {
  return axios.post(
    `/sharkio/sniffer/${port}/mock/actions/activate`,
    JSON.stringify({ mockId: `${method} ${endpoint}` }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const deactivateMock = (
  port: number,
  method: string,
  endpoint: string,
) => {
  return axios.post(
    `/sharkio/sniffer/${port}/mock/actions/deactivate`,
    JSON.stringify({ mockId: `${method} ${endpoint}` }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const getCollections = () => {
  return axios.get("/sharkio/collection");
};

export const createCollection = (name: string) => {
  return axios.post("/sharkio/collection", JSON.stringify({ name }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const saveRequestToCollection = (
  id: Collection["id"],
  request: InterceptedRequest,
) => {
  return axios.post(
    `/sharkio/collection/${id}/request`,
    JSON.stringify({ request }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
