import axios from "axios";
import { SnifferCreateConfig, } from "../types/types";

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
export const editSniffer = async (newConfig: SnifferCreateConfig) => {
  return axios.put(`/sharkio/sniffer/${newConfig.id}`, JSON.stringify(newConfig), {
    headers: {
      "Content-Type": "application/json",
    },
  });
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
    "/sharkio/sniffer/5555/actions/execute",
    { url, method, invocation },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
