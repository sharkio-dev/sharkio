import { Axios } from "axios";

const server = new Axios({
  baseURL: "http://localhost:5012",
});

export const getRequests = () => {
  return server.get("/tartigraid");
};

export type SnifferConfig = {
  port: number;
  downstreamUrl: string;
};

export const getConfig: () => Promise<SnifferConfig> = () => {
  return server.get("/tartigraid/config").then((res) => res.data);
};
