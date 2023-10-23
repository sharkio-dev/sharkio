import axios from "axios";

export const BackendAxios = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL ?? ""}/sharkio`,
  headers: {
    "Content-Type": "application/json",
  },
});
