import axios from "axios";

export const getKeys = () => {
  return axios.get("/sharkio/settings/api-keys");
};

export const postKey = (name: string) => {
  return axios.post("/sharkio/settings/api-keys", { name });
};

export const deleteKey = (id: string) => {
  return axios.delete(`/sharkio/settings/api-keys/${id}`);
};

export const editKey = (id: string, name: string) => {
  return axios.put(`/sharkio/settings/api-keys/${id}`, { name });
};
