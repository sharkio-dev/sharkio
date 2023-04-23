import { Axios } from "axios";

const server = new Axios({
  baseURL: "http://localhost:5012",
});

export const getRequests = () => {
  return server.get("/tartigraid");
};
