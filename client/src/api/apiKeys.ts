import { BackendAxios } from "./backendAxios";

export const getKeys = () => {
  return BackendAxios.get("/settings/api-keys");
};

export const postKey = (name: string) => {
  return BackendAxios.post("/settings/api-keys", { name });
};

export const deleteKey = (id: string) => {
  return BackendAxios.delete(`/settings/api-keys/${id}`);
};

export const editKey = (id: string, name: string) => {
  return BackendAxios.put(`/settings/api-keys/${id}`, { name });
};
