import { MockAxios } from "./backendAxios";

export const loadTestFlowsAPI = async () => {
  return MockAxios.get("/test-flows").then((res) => {
    return res.data;
  });
};
