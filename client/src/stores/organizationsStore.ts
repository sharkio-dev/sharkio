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

const postOrganization = (name: string, userId: string) => {
  return BackendAxios.post("/organizations", { name, userId });
};

const putOrganization = (organizationId: string, name: string) => {
  return BackendAxios.put(`/organizations/${organizationId}`, { name });
};

const deleteOrganization = (organizationId: string) => {
  return BackendAxios.delete(`/organizations/${organizationId}`);
};

const getMembers = (organizationId: string) => {
  return BackendAxios.get(`/organizations/id/members`);
};

const inviteMember = (organizationId: string, email: string) => {
  return BackendAxios.post(`/organizations/${organizationId}/invite`, {
    email,
  });
};

const removeMember = (organizationId: string, memberId: string) => {
  return BackendAxios.delete(
    `/organizations/${organizationId}/members/${memberId}`,
  );
};

const changeRole = (
  organizationId: string,
  memberId: string,
  isAdmin: boolean,
) => {
  return BackendAxios.put(
    `/organizations/${organizationId}/members/${memberId}`,
    {
      isAdmin,
    },
  );
};

const leaveOrganization = (organizationId: string) => {
  return BackendAxios.delete(`/organizations/${organizationId}/leave`);
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
