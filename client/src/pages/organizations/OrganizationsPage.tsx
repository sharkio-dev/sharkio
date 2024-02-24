import { useEffect } from "react";
import { useOrganizationsStore } from "../../stores/organizationsStore";
import { Button } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { IoPersonAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { GoBackButton } from "../flows/FlowStepPage";
import { IoMdAdd } from "react-icons/io";

const OrganzationsPage = () => {
  const { organizations, loadOrganizations } = useOrganizationsStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadOrganizations();
  }, []);

  return (
    <div className="flex flex-col w-full h-full p-4">
      <div className="flex flex-row justify-between items-center">
        <div className="text-2xl font-bold">Organizations</div>
        <Button variant="outlined" color="primary" startIcon={<IoMdAdd />}>
          Add
        </Button>
      </div>
      <div className="w-full border-b-[0.05px] mt-4 mb-8" />
      <div className="flex flex-col border-[0.05px] border-border-color rounded-md">
        {organizations.map((organization) => (
          <div
            key={organization.id}
            className="flex flex-row justify-between border-b-[0.05px] border-border-color p-4 rounded-md hover:bg-secondary active:bg-secondary "
          >
            <div className="flex flex-row items-center space-x-4">
              <span
                className="text-lg font-bold hover:cursor-pointer hover:scale-105"
                onClick={() => navigate(`/organizations/${organization.id}`)}
              >
                {organization.name}
              </span>
              <span
                className={`text-xs ${
                  organization.isAdmin ? "text-green-400" : "text-blue-400"
                } border-[0.05px] border-border-color rounded-xl px-2 py-1 cursor-auto`}
              >
                {organization.isAdmin ? "Admin" : "Member"}
              </span>
            </div>
            <div className="flex flex-row items-center space-x-4">
              <AiOutlineDelete className="text-red-500 text-xl hover:cursor-pointer hover:scale-105 active:text-red-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const OrganizationPage = () => {
  const { members, loadMembers } = useOrganizationsStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadMembers("id");
  }, []);

  return (
    <div className="flex flex-col w-full h-full p-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center space-x-2">
          <GoBackButton
            onClick={() => {
              navigate(-1);
            }}
          />
          <div className="text-2xl font-bold">Members</div>
        </div>
        <Button
          variant="outlined"
          color="success"
          startIcon={<IoPersonAddOutline />}
        >
          Invite
        </Button>
      </div>
      <div className="w-full border-b-[0.05px] mt-4 mb-8" />
      {members.length > 0 && (
        <div className="flex flex-col border-[0.05px] border-border-color rounded-md">
          {members.map((organization) => (
            <div
              key={organization.id}
              className="flex flex-row justify-between border-b-[0.05px] border-border-color p-4 rounded-md hover:bg-secondary active:bg-secondary "
            >
              <div className="flex flex-col">
                <span className="text-lg font-bold">{organization.name}</span>
                <span className="text-sm text-gray-400">
                  {organization.email}
                </span>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <span
                  className={`text-xs ${
                    organization.isAdmin ? "text-green-400" : "text-blue-400"
                  } border-[0.05px] border-border-color rounded-xl px-2 py-1 cursor-auto`}
                >
                  {organization.isAdmin ? "Admin" : "Member"}
                </span>
                <IoRemoveCircleOutline className="text-red-500 text-xl hover:cursor-pointer hover:scale-105 active:text-red-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganzationsPage;
