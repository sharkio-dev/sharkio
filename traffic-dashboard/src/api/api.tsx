import { Axios } from "axios";

const server = new Axios({
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

export const changeConfig: (config: SnifferConfig) => Promise<void> = (
  config: SnifferConfig
) => {
  return server.post("/tartigraid/config", JSON.stringify(config), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
