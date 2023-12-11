import axios from "axios";

export const BackendAxios = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL ?? ""}/sharkio`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const MockAxios = axios.create({
  baseURL: "https://test-flow-xw1zs.sniffer.sharkio.dev/sharkio",
  headers: {
    "Content-Type": "application/json",
  },
});
