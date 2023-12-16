import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import WorkspaceItem from "./WorkspaceItem";
import NewWorkspaceModal from "./NewWorkspaceModal";
import EditWorkspaceModal from "./EditWorkspaceModal";
import NewWorkspaceItem from "./NewWorkspaceItem";
import { DeleteWorkspaceModal } from "./DeleteWorkspaceModal";
import { useWorkspaceStore, workSpaceType } from "../../stores/workspaceStore";

export type openModal = "create" | "edit" | "delete" | "none";
const emptyWorkSpace: workSpaceType = {
  id: "",
  name: "",
};
const ISHIDDEN: boolean = true;
const WorkspaceSelector = () => {
  const [isModalOpen, setIsModalOpen] = useState<openModal>("none");
  const [workSpaceToEdit, setWorkSpaceToEdit] =
    useState<workSpaceType>(emptyWorkSpace);
  const {
    setWorkspaces,
    workspaces,
    openWorkspace,
    changeBetweenWorkSpaces,
    getWorkspaces,
  } = useWorkspaceStore();

  useEffect(() => {
    getWorkspaces().then((res) => {
      setWorkspaces(res.data);
      changeBetweenWorkSpaces(res.data[0].id);
    });
  }, []);

  const handleChangeWorkspace = async (workSpaceId: string) => {
    changeBetweenWorkSpaces(workSpaceId);
  };

  const handleEditWorkspace = (
    e: React.MouseEvent,
    workSpace: workSpaceType
  ) => {
    e.stopPropagation();
    setWorkSpaceToEdit(workSpace);
    setIsModalOpen("edit");
  };

  const handleDeleteWorkspace = (
    e: React.MouseEvent,
    workSpace: workSpaceType
  ) => {
    e.stopPropagation();
    setWorkSpaceToEdit(workSpace);
    setIsModalOpen("delete");
  };

  const handleModalIsClosed = () => {
    setWorkSpaceToEdit(emptyWorkSpace);
    setIsModalOpen("none");
  };
  return (
    <div>
      {ISHIDDEN && (
        <>
          <FormControl fullWidth size="small">
            <InputLabel>workspaces</InputLabel>
            <Select
              style={{ width: "200px" }}
              value={openWorkspace.id}
              label="Workspace"
              onChange={(e) => handleChangeWorkspace(e.target.value as string)}
            >
              <NewWorkspaceItem
                setIsModalOpen={() => setIsModalOpen("create")}
              />
              {workspaces.map((workspace: workSpaceType) => {
                return (
                  <MenuItem key={workspace.id} value={workspace.id}>
                    <WorkspaceItem
                      workspace={workspace}
                      handleEditWorkspace={handleEditWorkspace}
                      handleDeleteWorkspace={handleDeleteWorkspace}
                    />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <NewWorkspaceModal
            isModalOpen={isModalOpen === "create"}
            onCancel={handleModalIsClosed}
          />
          <EditWorkspaceModal
            isModalOpen={isModalOpen === "edit"}
            onCancel={handleModalIsClosed}
            workSpace={workSpaceToEdit}
          />
          <DeleteWorkspaceModal
            isModalOpen={isModalOpen === "delete"}
            onCancel={handleModalIsClosed}
            workSpace={workSpaceToEdit}
          />
        </>
      )}
    </div>
  );
};

export default WorkspaceSelector;
