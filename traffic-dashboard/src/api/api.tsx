import axios from "axios";
import { SnifferCreateConfig } from "../types/types";

// const snifferAdminAxios = new axios.Axios({ baseURL: "http://localhost:5012" });

export const createSniffer = (config: SnifferCreateConfig) => {
  return axios.post("/sharkio/sniffer", JSON.stringify(config), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getSniffers = () => {
  return axios.get("/sharkio/sniffer");
};

export const stopSniffer = (port: number) => {
  return axios.post(`/sharkio/sniffer/${port}/actions/stop`);
};

export const startSniffer = async (port: number) => {
  return await axios.post(`/sharkio/sniffer/${port}/actions/start`);
};
export const deleteSniffer = async (port: number) => {
  return await axios.delete(`/sharkio/sniffer/${port}`);
};

export const getRequests = () => {
  return axios.get("/sharkio/sniffer/invocation");
};

export const executeRequest = (
  url: string,
  method: string,
  invocation: any
) => {
  return axios.post(
    "/sharkio/sniffer/5100/actions/execute",
    { url, method, invocation },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
