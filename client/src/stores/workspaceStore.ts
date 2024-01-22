import { create } from "zustand";
import {
  deleteWorkSpace,
  getUserWorkspaces,
  getWorkspaceUsers,
  postAddNewWorkspace,
  putEditWorkSpaceName,
} from "../api/workspacesApi";

export interface workSpaceType {
  name: string;
  id: string;
  userId: string;
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
  getWorkspaceUsers: (workspaceId: string) => Promise<any>;
}

export const useWorkspaceStore = create<workspaceStore>((set, get) => ({
  workspaces: [],
  openWorkspace: {
    name: "",
    id: "",
    userId: "",
  },

  getWorkspaces: () => {
    return getUserWorkspaces().then((res) => {
      set({ workspaces: res.data });
      return res.data;
    });
  },
  getWorkspaceUsers: (workspaceId: string) => {
    return getWorkspaceUsers(workspaceId).then((res) => {
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
    return postAddNewWorkspace(newWorkspaceName).then(() => {
      get().getWorkspaces();
    });
  },
  deleteWorkspace: (workspaceId: string) => {
    return deleteWorkSpace(workspaceId).then(() => {
      get()
        .getWorkspaces()
        .then((res) => {
          if (
            res.length > 0 &&
            get().workspaces.find((w) => w.id === get().openWorkspace.id) ===
              undefined
          ) {
            set({ openWorkspace: res[0] });
          }
        });
    });
  },
}));
