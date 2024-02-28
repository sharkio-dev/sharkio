import { useEffect } from "react";
import { useOrganizationsStore } from "../../stores/organizationsStore";
import { Button, Tab } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { IoPersonAddOutline } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GoBackButton } from "../flows/FlowStepPage";
import { IoMdAdd } from "react-icons/io";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import GenericEditingModal from "../../components/project-selection/GenericEditingModal";
import React from "react";
import { GenericDeleteButton } from "../flows/TestsTab";
import { EditableNameField } from "../flows/EditableNameProps";

const AddOrgranizationButton = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [organizationName, setOrganizationName] = React.useState("");
  const { postOrganization, isPostOrganizationLoading } =
    useOrganizationsStore();

  const handleOrganizationNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setOrganizationName(e.target.value);
  };
  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<IoMdAdd />}
        onClick={() => setIsModalOpen(true)}
      >
        Add
      </Button>
      <GenericEditingModal
        modalProps={{
          open: isModalOpen,
          onClose: () => {
            setIsModalOpen(false);
          },
        }}
        paperHeadLine="New Organization"
        acceptButtonValue="Create"
        acceptButtonProps={{
          onClick: () => {
            postOrganization(organizationName).then(() => {
              setOrganizationName("");
              setIsModalOpen(false);
            });
          },
        }}
        cancelButtonProps={{
          onClick: () => {
            setIsModalOpen(false);
          },
        }}
        textFieldProps={{
          label: "Organization Name",
          placeholder: "Enter organization name",
          onChange: handleOrganizationNameChange,
        }}
        isLoading={isPostOrganizationLoading}
      />
    </>
  );
};

const DeleteOrganizationButton = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { deleteOrganization } = useOrganizationsStore();

  return (
    <>
      <AiOutlineDelete className="text-red-500 text-xl hover:cursor-pointer hover:scale-105 active:text-red-400" />
    </>
  );
};

const OrganzationsPage = () => {
  const {
    organizations,
    loadOrganizations,
    deleteOrganization,
    isDeleteOrganizationLoading,
  } = useOrganizationsStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadOrganizations();
  }, []);

  return (
    <div className="flex flex-col w-full h-full p-4">
      <div className="flex flex-row justify-between items-center">
        <div className="text-2xl font-bold">Organizations</div>
        <AddOrgranizationButton />
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
              <GenericDeleteButton
                onClick={() => deleteOrganization(organization.id)}
              />
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
  const [searchParams, setSearchParams] = useSearchParams();

  const handleTabChange = (_: any, newValue: string) => {
    setSearchParams((prevSearchParams) => {
      const newSearchParams = new URLSearchParams(prevSearchParams);
      newSearchParams.set("tab", newValue);
      return newSearchParams;
    });
  };

  useEffect(() => {
    loadMembers("id");
  }, []);

  return (
    <div className="flex flex-col w-full h-full p-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center space-x-2">
          <GoBackButton
            onClick={() => {
              navigate("/organizations");
            }}
          />
          <div className="text-2xl font-bold">Org Name</div>
        </div>
        <div className="flex flex-row items-center space-x-4">
          <Button
            variant="outlined"
            color="success"
            startIcon={<IoPersonAddOutline />}
          >
            Invite
          </Button>
          <Button variant="outlined" color="error">
            Leave
          </Button>
        </div>
      </div>
      <div className="w-full border-b-[0.05px] mt-4 mb-4" />
      <TabContext value={searchParams.get("tab") || "1"}>
        <TabList
          onChange={handleTabChange}
          className="border-b-[0.1px] border-border-color"
        >
          <Tab label="Members" value="1" />
        </TabList>
        <TabPanel value="1" style={{ padding: 0, height: "100%" }}>
          <div className="flex flex-col w-full h-full py-4">
            {members.length > 0 && (
              <div className="flex flex-col border-[0.05px] border-border-color rounded-md">
                {members.map((organization) => (
                  <div
                    key={organization.id}
                    className="flex flex-row justify-between border-b-[0.05px] border-border-color p-2 rounded-md hover:bg-secondary active:bg-secondary "
                  >
                    <div className="flex flex-col">
                      <span className="text-lg font-bold">
                        {organization.name}
                      </span>
                      <span className="text-sm text-gray-400">
                        {organization.email}
                      </span>
                    </div>
                    <div className="flex flex-row items-center space-x-2">
                      <span
                        className={`text-xs ${
                          organization.isAdmin
                            ? "text-green-400"
                            : "text-blue-400"
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
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default OrganzationsPage;
