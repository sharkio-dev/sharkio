import { create } from "zustand";
import { BackendAxios } from "../api/backendAxios";

type Organization = {
  name: string;
  id: string;
  isAdmin: boolean;
};
type Member = {
  name: string;
  id: string;
  isAdmin: boolean;
  email: string;
};

interface OrganizationsState {
  organizations: Organization[];
  members: Member[];
  loadOrganizations: () => Promise<void>;
  loadMembers: (organizationId: string) => Promise<void>;
}

const getOrganizations = () => {
  return BackendAxios.get("/organizations");
};

const getMembers = (organizationId: string) => {
  return BackendAxios.get(`/organizations/id/members`);
};

export const useOrganizationsStore = create<OrganizationsState>((set) => ({
  organizations: [],
  members: [],
  loadOrganizations: () => {
    return getOrganizations().then((res) => set({ organizations: res.data }));
  },
  loadMembers: (organizationId: string) => {
    return getMembers(organizationId).then((res) => set({ members: res.data }));
  },
}));
