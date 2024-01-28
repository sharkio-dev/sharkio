import axios from "axios";

export let BackendAxios = axios.create({
  // @ts-ignore
  baseURL: `${window.env.VITE_SERVER_URL ?? ""}/sharkio`,
  headers: {
    "Content-Type": "application/json",
  },
  params: {
    workspaceId: new URLSearchParams(window.location.search).get("workspaceId"),
  },
});
