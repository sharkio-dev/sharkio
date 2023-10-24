import axios from "axios";

const ServerAxios = axios.create({
  baseURL: "http://localhost:5012/sharkio/api",
});

export default ServerAxios;
