import {
  Collection,
  InterceptedRequest,
  SnifferCreateConfig,
} from "../types/types";
import { BackendAxios } from "./backendAxios";
import { SnifferType } from "../stores/sniffersStores";
import { Mock } from "../stores/mockStore";
import * as projectsData from "./fakeProjectData.json";

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
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export const getProjects = (): ProjectType[] => {
  const jsonData = projectsData as { projects: any[] };
  const projects: ProjectType[] = jsonData.projects.map((project) => {
    return {
      name: project.name,
      id: project.id,
      isOpen: project.isOpen,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      deletedAt: project.deletedAt,
    };
  });
  return projects;
};
export const getChangeBetweenProjects = async (projectClickName: string) => {
  // Simulating the get operation by finding the project in the JSON data
  const project = (projectsData as { projects: ProjectType[] }).projects.find(
    (p) => p.name === projectClickName
  );

  console.log("move to project", project);
  return project; // Return the project or handle the logic accordingly
};

export const deleteProject = async (projectName: string) => {
  // Simulating the delete operation by filtering out the project from the JSON data
  (projectsData as { projects: ProjectType[] }).projects =
    projectsData.projects.filter((p) => p.name !== projectName);

  console.log("delete project", projectName);
  // You can optionally save the updated data back to the file here if needed

  return { success: true }; // Return a success message or handle the logic accordingly
};

export const postAddNewProject = async (newProjectName: string) => {
  // Simulating the post operation by adding a new project to the JSON data
  const newProject: ProjectType = {
    id: Date.now().toString(), // Assuming a simple timestamp-based ID for demo purposes
    name: newProjectName,
    isOpen: true, // Set default values
  };

  (projectsData as { projects: ProjectType[] }).projects.push(newProject);

  console.log("add new project", newProject);
  // You can optionally save the updated data back to the file here if needed

  return newProject; // Return the newly added project or handle the logic accordingly
};

export const putEditProject = async (
  editedProjectName: string,
  selectedProjectName: string
) => {
  // Simulating the put operation by updating the project in the JSON data
  const projectToUpdate = (
    projectsData as { projects: ProjectType[] }
  ).projects.find((p) => p.name === selectedProjectName);

  if (projectToUpdate) {
    projectToUpdate.name = editedProjectName;
    projectToUpdate.updatedAt = new Date().toISOString();
  }

  console.log(
    "new name=",
    editedProjectName,
    " old name=",
    selectedProjectName
  );
  // You can optionally save the updated data back to the file here if needed

  return projectToUpdate; // Return the updated project or handle the logic accordingly
};
