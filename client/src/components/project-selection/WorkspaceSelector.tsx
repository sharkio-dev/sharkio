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
  isOpen: false,
};
const ISHIDDEN: boolean = true;
const WorkspaceSelector = () => {
  const [modalIsOpen, setModalIsOpen] = useState<openModal>("none");
  const [workSpaceToEdit, setWorkSpaceToEdit] =
    useState<workSpaceType>(emptyWorkSpace);
  const { workspaces, openWorkspace, changeBetweenWorkSpaces, getWorkspaces } =
    useWorkspaceStore();

  useEffect(() => {
    getWorkspaces();
  }, []);

  const handleChangeWorkspace = async (workSpaceId: string) => {
    changeBetweenWorkSpaces(workSpaceId);
  };

  const handleEditWorkspace = (
    e: React.MouseEvent,
    workSpace: workSpaceType,
  ) => {
    e.stopPropagation();
    setWorkSpaceToEdit(workSpace);
    setModalIsOpen("edit");
  };

  const handleDeleteWorkspace = (
    e: React.MouseEvent,
    workSpace: workSpaceType,
  ) => {
    e.stopPropagation();
    setModalIsOpen("delete");
    setWorkSpaceToEdit(workSpace);
  };

  const handleModalIsClosed = () => {
    setWorkSpaceToEdit(emptyWorkSpace);
    setModalIsOpen("none");
  };
  return (
    <div>
      {!ISHIDDEN && (
        <>
          <FormControl fullWidth size="small">
            <InputLabel>workspaces</InputLabel>
            <Select
              style={{ width: "200px" }}
              value={openWorkspace.name}
              label="workspace"
            >
              <NewWorkspaceItem setModalIsOpen={setModalIsOpen} />
              {workspaces.map((workspace: workSpaceType) => {
                return (
                  <MenuItem
                    key={workspace.id}
                    value={workspace.name}
                    onClick={() => handleChangeWorkspace(workspace.id)}
                  >
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
            modalIsOpen={modalIsOpen}
            onCancel={handleModalIsClosed}
          />
          <EditWorkspaceModal
            modalIsOpen={modalIsOpen}
            onCancel={handleModalIsClosed}
            workSpace={workSpaceToEdit}
          />
          <DeleteWorkspaceModal
            modalIsOpen={modalIsOpen}
            onCancel={handleModalIsClosed}
            workSpace={workSpaceToEdit}
          />
        </>
      )}
    </div>
  );
};

export default WorkspaceSelector;
