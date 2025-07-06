import axios from "axios";

export let BackendAxios = axios.create({
  // @ts-ignore
  baseURL: `${window._env_.VITE_SERVER_URL ?? "http://localhost:5012"}/sharkio`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  params: {
    workspaceId: new URLSearchParams(window.location.search).get("workspaceId"),
  },
});
