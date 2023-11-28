import ServerAxios from "./serverAxios.js";

export const createLocalSniffers = async ({ ports, downstreamUrl }) => {
  return ServerAxios.put(`/sniffer/local`, {
    downstreamUrl,
    ports
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};

export const getSniffers = async () => {
  return ServerAxios.get("/sniffers").then((res) => res.data.sniffers);
};
