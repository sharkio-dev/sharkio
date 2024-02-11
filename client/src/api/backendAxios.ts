import axios from "axios";

export let BackendAxios = axios.create({
  // @ts-ignore
  baseURL: `${import.meta.env.VITE_SERVER_URL ?? ""}/sharkio`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  params: {
    workspaceId: new URLSearchParams(window.location.search).get("workspaceId"),
  },
});
