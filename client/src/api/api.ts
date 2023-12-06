import {
  Collection,
  InterceptedRequest,
  SnifferCreateConfig,
} from "../types/types";
import { BackendAxios } from "./backendAxios";
import { SnifferType } from "../stores/sniffersStores";
import { Mock } from "../stores/mockStore";

export const createSniffer = (config: Omit<SnifferCreateConfig, "id">) => {
  return BackendAxios.post("/sniffer", config);
};

export const getSniffers = () => {
  return BackendAxios.get<SnifferType[]>("/sniffer");
};

export const getSniffer = (port: number) => {
  return BackendAxios.get(`/sniffer/${port}`);
};

export const stopSniffer = (id: string) => {
  return BackendAxios.post(`/sniffer/${id}/actions/stop`);
};

export const startSniffer = async (id: string) => {
  return await BackendAxios.post(`/sniffer/${id}/actions/start`);
};

export const deleteSniffer = async (id: string) => {
  return await BackendAxios.delete(`/sniffer/${id}`);
};

export const editSniffer = async (
  newConfig: Partial<Omit<SnifferType, "subdomain">>
) => {
  return BackendAxios.put(`/sniffer/${newConfig.id}`, newConfig);
};

export const getRequests = () => {
  return BackendAxios.get("/request");
};

export const getAllMocks = () => {
  return BackendAxios.get("/sniffer/action/getMocks");
};

export const createMock = (
  snifferId: string,
  method: string,
  endpoint: string,
  status: number,
  data: any
) => {
  return BackendAxios.post(`/sniffer/${snifferId}/mock`, {
    sniffer_id: snifferId,
    method,
    endpoint,
    data,
    status,
  });
};

export const editMock = (
  id: string,
  port: number,
  method: string,
  endpoint: string,
  status: number,
  data: any
) => {
  return BackendAxios.put(`/sniffer/${port}/mock`, {
    mockId: id,
    method,
    endpoint,
    data,
    status,
  });
};

export const deleteMock = (id: string, sniffer_id: string) => {
  return BackendAxios.delete(`/sniffer/${sniffer_id}/mock`, {
    data: { mockId: id },
  });
};

export const getCollections = () => {
  return BackendAxios.get("/collection");
};

export const createCollection = (name: string) => {
  return (
    BackendAxios.post("/collection", { name }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const saveRequestToCollection = (
  id: Collection["id"],
  request: InterceptedRequest
) => {
  return BackendAxios.post(`/collection/${id}/request`, { request });
};

export const getInvocations = (requestId: string) => {
  return BackendAxios.get(`/request/${requestId}/invocation`).then((res) => {
    return res.data;
  });
};

export const getEnpoints = (snifferId: string) => {
  return BackendAxios.get(`/sniffer/${snifferId}/request`).then((res) => {
    return res.data;
  });
};

export const getLiveInvocations = () => {
  return BackendAxios.get(`/invocation`).then((res) => {
    return res.data;
  });
};
export const executeInvocationAPI = (invocation: {
  testId?: string;
  snifferId: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
}) => {
  const url = invocation.url;
  const method = invocation.method;
  const headers = invocation.headers;
  const body = invocation.body;

  return BackendAxios.post("/request/execute", {
    snifferId: invocation.snifferId,
    url,
    method,
    headers,
    body,
  }).then((res) => {
    return res.data;
  });
};

export const loadChat = (chatId: string) => {
  return BackendAxios.get(`/chat/${chatId}`);
};

export const newChat = (content: string) => {
  return BackendAxios.post(`/chat`, { content });
};

export const newMessage = (chatId: string, content: string) => {
  return BackendAxios.post(`/chat/${chatId}/message`, { content });
};

export const getMocksAPI = (snifferId: string) => {
  return BackendAxios.get(`/sniffer/${snifferId}/mocks`);
};

export const activateMockAPI = (mockId: string) => {
  return BackendAxios.post(`/mocks/${mockId}/activate`);
};

export const deactivateMockAPI = (mockId: string) => {
  return BackendAxios.post(`/mocks/${mockId}/deactivate`);
};

export const deleteMockAPI = (mockId: string) => {
  return BackendAxios.delete(`/mocks/${mockId}`);
};

export const createMockAPI = (
  mock: Omit<Mock, "id"> & { snifferId: string }
) => {
  return BackendAxios.post(`/mocks`, mock).then((res) => {
    return res.data;
  });
};

export const editMockAPI = (
  mockId: string,
  mock: Partial<Omit<Mock, "id">>
) => {
  return BackendAxios.patch(`/mocks/${mockId}`, mock);
};
export interface ProjectType {
  name: string;
  id: string;
  isOpen: boolean;
}

export const projectsArray: ProjectType[] = [
  { name: "project1", id: "1", isOpen: false },
  { name: "project2", id: "2", isOpen: true },
  { name: "project3", id: "3", isOpen: false },
  { name: "project4", id: "4", isOpen: false },
];

export const getProjects = (): ProjectType[] => {
  //will get all the user projects from the backend
  return projectsArray;
};

export const getChangeBetweenProjects = async (projectClick: String) => {
  // Change between projects logic here
  console.log("move to project", projectClick);
  return await BackendAxios.get(`/project/${projectClick}`);
};

//Delete project
export const deleteProject = async (projectName: string) => {
  // Delete project logic here
  console.log("delete project", projectName);
  return await BackendAxios.delete(`/project/${projectName}`);
};

export const postAddNewProject = async (newProjectName: string) => {
  // Add new project logic here
  //need to check if project name already exists
  console.log("add new project", newProjectName);
  return await BackendAxios.post("/project", {
    name: newProjectName,
  });
};

export const putEditProject = async (
  editedProjectName: string,
  selectedProjectName: string
) => {
  // Edit project logic here
  //need to check if project name already exists
  console.log(
    "new name=",
    editedProjectName,
    " old name=",
    selectedProjectName
  );
  return await BackendAxios.put(`/project/${selectedProjectName}`, {
    name: editedProjectName,
  });
};
