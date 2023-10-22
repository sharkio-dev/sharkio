import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import axios from "axios";
import {
  Collection,
  InterceptedRequest,
  Invocation,
  SnifferConfig,
  SnifferCreateConfig,
} from "../types/types";

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

const serverUrl = import.meta.env.VITE_SERVER_URL ?? "";

export const createSniffer = (config: Omit<SnifferCreateConfig, "id">) => {
  return axios.post(serverUrl + "/sharkio/sniffer", JSON.stringify(config), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getSniffers = () => {
  return axios.get<SnifferConfig[]>(serverUrl + "/sharkio/sniffer");
};

export const getSniffer = (port: number) => {
  return axios.get(serverUrl + `/sharkio/sniffer/${port}`);
};

export const stopSniffer = (id: string) => {
  return axios.post(serverUrl + `/sharkio/sniffer/${id}/actions/stop`);
};

export const startSniffer = async (id: string) => {
  return await axios.post(serverUrl + `/sharkio/sniffer/${id}/actions/start`);
};

export const deleteSniffer = async (id: string) => {
  return await axios.delete(serverUrl + `/sharkio/sniffer/${id}`);
};

export const editSniffer = async (newConfig: SnifferCreateConfig) => {
  return axios.put(
    serverUrl + `/sharkio/sniffer/${newConfig.id}`,
    JSON.stringify(newConfig),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const getRequests = () => {
  return axios.get(serverUrl + "/sharkio/sniffer/invocation");
};

export const executeRequest = (
  port: number,
  url: string,
  method: string,
  invocation: Invocation,
) => {
  return axios.post(
    serverUrl + `/sharkio/sniffer/${port}/actions/execute`,
    JSON.stringify({ url, method, invocation }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const getAllMocks = () => {
  return axios.get(serverUrl + "/sharkio/sniffer/action/getMocks");
};

export const createMock = (
  snifferId: string,
  method: string,
  endpoint: string,
  status: number,
  data: any,
) => {
  return axios.post(
    serverUrl + `/sharkio/sniffer/${snifferId}/mock`,
    JSON.stringify({ sniffer_id: snifferId, method, endpoint, data, status }),
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
    serverUrl + `/sharkio/sniffer/${port}/mock`,
    JSON.stringify({ mockId: id, method, endpoint, data, status }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const deleteMock = (id: string, sniffer_id: string) => {
  return axios.delete(serverUrl + `/sharkio/sniffer/${sniffer_id}/mock`, {
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
    serverUrl + `/sharkio/sniffer/${port}/mock/actions/activate`,
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
    serverUrl + `/sharkio/sniffer/${port}/mock/actions/deactivate`,
    JSON.stringify({ mockId: `${method} ${endpoint}` }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const getCollections = () => {
  return axios.get(serverUrl + "/sharkio/collection");
};

export const createCollection = (name: string) => {
  return axios.post(
    serverUrl + "/sharkio/collection",
    JSON.stringify({ name }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const saveRequestToCollection = (
  id: Collection["id"],
  request: InterceptedRequest,
) => {
  return axios.post(
    serverUrl + `/sharkio/collection/${id}/request`,
    JSON.stringify({ request }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
