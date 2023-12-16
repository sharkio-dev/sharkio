import { create } from "zustand";
import {
  deleteWorkSpace,
  getUserWorkspaces,
  postAddNewWorkspace,
  putEditWorkSpaceName,
} from "../api/workspacesApi";
import { AxiosResponse } from "axios";

export interface workSpaceType {
  name: string;
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

interface workspaceStore {
  workspaces: workSpaceType[];
  openWorkspace: workSpaceType;
  setWorkspaces: (workspaces: workSpaceType[]) => void;
  getWorkspaces: () => Promise<AxiosResponse<workSpaceType[], any>>;
  changeBetweenWorkSpaces: (workSpaceId: string) => void;
  editWorkSpaceName: (name: string, id: string) => Promise<void>;
  createWorkspace: (name: string) => void;
  deleteWorkspace: (id: string) => Promise<void>;
}

export const useWorkspaceStore = create<workspaceStore>((set, get) => ({
  workspaces: [],
  openWorkspace: {
    name: "",
    id: "",
  },

  getWorkspaces: () => {
    return getUserWorkspaces();
  },
  setWorkspaces: (workspaces: workSpaceType[]) => {
    set({ workspaces: workspaces });
  },
  changeBetweenWorkSpaces: (workspaceId: string) => {
    set({ openWorkspace: get().workspaces.find((w) => w.id === workspaceId) });
  },

  editWorkSpaceName: (newWorkspaceName: string, workspaceId: string) => {
    const workspace = get().workspaces.find((w) => w.name === newWorkspaceName);
    if (workspace !== undefined) {
      return Promise.reject("Workspace already exists");
    }
    return putEditWorkSpaceName(newWorkspaceName, workspaceId).then(() => {
      get()
        .getWorkspaces()
        .then((res) => {
          set({ workspaces: res.data });
        });
    });
  },

  createWorkspace: async (newWorkspaceName: string) => {
    await postAddNewWorkspace(newWorkspaceName);
    get()
      .getWorkspaces()
      .then((res) => {
        set({ workspaces: res.data });
        set({
          openWorkspace: res.data.find((w) => w.name === newWorkspaceName),
        });
      });
  },
  deleteWorkspace: (workspaceId: string) => {
    return deleteWorkSpace(workspaceId).then(() => {
      get()
        .getWorkspaces()
        .then((res) => {
          set({ workspaces: res.data });
          if (get().openWorkspace.id === workspaceId) {
            get().changeBetweenWorkSpaces(get().workspaces[0].id);
          }
        });
    });
  },
}));
