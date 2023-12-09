import { create } from "zustand";
import {
  deleteWorkSpace,
  getChangeBetweenWorkSpaces,
  getProjects,
  postAddNewWorkspace,
  putEditWorkSpaceName,
} from "../api/api";

export interface workSpaceType {
  name: string;
  id: string;
  isOpen: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface workspaceStore {
  workspaces: workSpaceType[];
  openWorkspace: workSpaceType;
  getWorkspaces: () => void;
  changeBetweenWorkSpaces: (workSpaceId: string) => void;
  editWorkSpaceName: (name: string, id: string) => Promise<void>;
  createWorkspace: (name: string) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
}

export const useWorkspaceStore = create<workspaceStore>((set, get) => ({
  workspaces: [],
  openWorkspace: {
    name: "",
    id: "",
    isOpen: false,
  },

  getWorkspaces: () => {
    getProjects().then((res) => {
      set({ workspaces: res.data });
    });
  },
  changeBetweenWorkSpaces: (workSpaceId: string) => {
    set({ openWorkspace: get().workspaces.find((w) => w.id === workSpaceId) });
    // return getChangeBetweenWorkSpaces(workSpaceId).then((res) => {
    //   set({ openWorkspace: res.data });
    //   get().getWorkspaces();
    // });
    //? 1 - Every time i change workspace i should call it form the db and update the isOpen property.
    //? 2 - Should i just find it in the workspaces array and removed the isOpen property (and the first one in the array will be the default project when you open the app). (later we can add feature to change the array order)
  },

  editWorkSpaceName: (newWorkspaceName: string, workspaceId: string) => {
    return putEditWorkSpaceName(newWorkspaceName, workspaceId).then(() => {
      get().getWorkspaces();
    });
  },
  createWorkspace: (newWorkSpaceName: string) => {
    return postAddNewWorkspace(newWorkSpaceName).then(() => {
      get().getWorkspaces();
    });
  },
  deleteWorkspace: (workspaceId: string) => {
    return deleteWorkSpace(workspaceId).then(() => {
      get().getWorkspaces();
    });
  },
}));
