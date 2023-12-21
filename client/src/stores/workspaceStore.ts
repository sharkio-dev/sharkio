import { create } from "zustand";
import {
  deleteWorkSpace,
  getUserWorkspaces,
  postAddNewWorkspace,
  putEditWorkSpaceName,
} from "../api/workspacesApi";

export interface workSpaceType {
  name: string;
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

interface workspaceStore {
  workspaces: workSpaceType[];
  openWorkspace: workSpaceType;
  getWorkspaces: () => Promise<workSpaceType[]>;
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
    return getUserWorkspaces().then((res) => {
      set({ workspaces: res.data });
      return res.data;
    });
  },
  changeBetweenWorkSpaces: (workspaceId: string) => {
    set({ openWorkspace: get().workspaces.find((w) => w.id === workspaceId) });
  },

  editWorkSpaceName: (newWorkspaceName: string, workspaceId: string) => {
    return putEditWorkSpaceName(newWorkspaceName, workspaceId).then(() => {
      get().getWorkspaces();
    });
  },

  createWorkspace: async (newWorkspaceName: string) => {
    return postAddNewWorkspace(newWorkspaceName).then(({ data }) => {
      set({ openWorkspace: data });
      get().getWorkspaces();
    });
  },
  deleteWorkspace: (workspaceId: string) => {
    return deleteWorkSpace(workspaceId).then(() => {
      get()
        .getWorkspaces()
        .then((res) => {
          if (res.length > 0) {
            set({ openWorkspace: res[0] });
          }
        });
    });
  },
}));
