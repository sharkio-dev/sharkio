import axios from "axios";

export const AUTH_TOKEN_STORAGE_KEY = "auth-token";

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

BackendAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});
