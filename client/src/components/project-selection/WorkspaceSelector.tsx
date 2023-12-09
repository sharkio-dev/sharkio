import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import WorkspaceItem from "./WorkspaceItem";
import NewWorkspaceModal from "./NewWorkspaceModal";
import EditWorkspaceModal from "./EditWorkspaceModal";
import NewWorkspaceItem from "./NewWorkspaceItem";
import { DeleteWorkspaceModal } from "./DeleteWorkspaceModal";
import { useWorkspaceStore, workSpaceType } from "../../stores/workspaceStore";

//TODO Connect workspaces to specific user in db
//TODO: make all the jsx as one component (in edit\add\delete) calls editModal and pass needed props and remove duplicated code
const emptyWorkSpace: workSpaceType = {
  id: "",
  name: "",
  isOpen: false,
};
const WorkspaceSelector = () => {
  const [newWorkspaceModalIsOpen, setNewProjectModalIsOpen] = useState(false);
  const [editWorkspaceModalIsOpen, setEditWorkspaceModalIsOpen] = useState(false);
  const [deleteWorkspaceModalIsOpen, setDeleteWorkspaceModalIsOpen] =
    useState(false);

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

  const handleNewWorkspaceEnd = () => {
    setNewProjectModalIsOpen(false);
  };

  const handleEditWorkspace = (e: React.MouseEvent, workSpace: workSpaceType) => {
    e.stopPropagation();
    setWorkSpaceToEdit(workSpace);
    setEditWorkspaceModalIsOpen(true);
  };

  const handleEditWorkspaceEnd = () => {
    setWorkSpaceToEdit(emptyWorkSpace);
    setEditWorkspaceModalIsOpen(false);
  };

  const handleDeleteWorkspace = (
    e: React.MouseEvent,
    workSpace: workSpaceType,
  ) => {
    e.stopPropagation();
    setDeleteWorkspaceModalIsOpen(true);
    setWorkSpaceToEdit(workSpace);
  };

  const handleDeleteWorkspaceEnd = () => {
    setDeleteWorkspaceModalIsOpen(false);
    setWorkSpaceToEdit(emptyWorkSpace);
  };

  return (
    <div>
      <FormControl fullWidth size="small">
        <InputLabel>NameSpaces</InputLabel>
        <Select
          style={{ width: "200px" }}
          value={openWorkspace?.name || ""}
          label="project"
        >
          <NewWorkspaceItem setNewProjectModalIsOpen={setNewProjectModalIsOpen} />
          {workspaces.map((project: workSpaceType) => {
            return (
              <MenuItem
                key={project.id}
                value={project.name}
                onClick={() => handleChangeWorkspace(project.id)}
              >
                <WorkspaceItem
                  project={project}
                  handleEditProject={handleEditWorkspace}
                  handleDeleteProject={handleDeleteWorkspace}
                />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <NewWorkspaceModal
        open={newWorkspaceModalIsOpen}
        onCancel={handleNewWorkspaceEnd}
      />

      <EditWorkspaceModal
        open={editWorkspaceModalIsOpen}
        onCancel={handleEditWorkspaceEnd}
        workSpace={workSpaceToEdit}
      />
      <DeleteWorkspaceModal
        workSpace={workSpaceToEdit}
        open={deleteWorkspaceModalIsOpen}
        onCancel={handleDeleteWorkspaceEnd}
      />
    </div>
  );
};

export default WorkspaceSelector;
