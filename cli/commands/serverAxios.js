import axios from "axios";
import https from "https";

const ServerAxios = axios.create({
  baseURL: "https://server.sharkio.dev/sharkio/api",
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

export default ServerAxios;
