import React, { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ProjectItem from "./ProjectItem";
import NewProjectModal from "./NewProjectModal";
import EditProjectModal from "./EditProjectModal";
import NewProjectItem from "./NewProjectItem";
import { DeleteProjectModal } from "./DeleteProjectModal";
import { useWorkspaceStore, workSpaceType } from "../../stores/workspaceStore";

//TODO Connect workspaces to specific user in db
//TODO: make all the jsx as one component (in edit\add\delete) calls editModal and pass needed props and remove duplicated code
const emptyWorkSpace: workSpaceType = {
  id: "",
  name: "",
  isOpen: false,
};
const ProjectSelector = () => {
  //const [workSpaces, setWorkSpaces] = useState<workSpaceType[]>([]);
  const [newProjectModalIsOpen, setNewProjectModalIsOpen] = useState(false);
  const [editProjectModalIsOpen, setEditProjectModalIsOpen] = useState(false);
  const [deleteProjectModalIsOpen, setDeleteProjectModalIsOpen] =
    useState(false);

  const [workSpaceToEdit, setWorkSpaceToEdit] =
    useState<workSpaceType>(emptyWorkSpace);
  //const [selectedWorkSpace, setSelectedWorkSpace] = useState<workSpaceType>();
  const { workspaces, openWorkspace, changeBetweenWorkSpaces, getWorkspaces } =
    useWorkspaceStore();

  useEffect(() => {
    getWorkspaces();
  }, []);

  const handleChangeProject = async (workSpaceId: string) => {
    changeBetweenWorkSpaces(workSpaceId);
  };

  const handleNewProjectEnd = () => {
    setNewProjectModalIsOpen(false);
  };

  const handleEditProject = (e: React.MouseEvent, workSpace: workSpaceType) => {
    e.stopPropagation();
    setWorkSpaceToEdit(workSpace);
    setEditProjectModalIsOpen(true);
  };

  const handleEditProjectEnd = () => {
    setWorkSpaceToEdit(emptyWorkSpace);
    setEditProjectModalIsOpen(false);
  };

  const handleDeleteProject = (
    e: React.MouseEvent,
    workSpace: workSpaceType
  ) => {
    e.stopPropagation();
    setDeleteProjectModalIsOpen(true);
    setWorkSpaceToEdit(workSpace);
  };

  const handleDeleteProjectEnd = () => {
    setDeleteProjectModalIsOpen(false);
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
          <NewProjectItem setNewProjectModalIsOpen={setNewProjectModalIsOpen} />
          {workspaces.map((project: workSpaceType) => {
            return (
              <MenuItem
                key={project.id}
                value={project.name}
                onClick={() => handleChangeProject(project.id)}
              >
                <ProjectItem
                  project={project}
                  handleEditProject={handleEditProject}
                  handleDeleteProject={handleDeleteProject}
                />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <NewProjectModal
        open={newProjectModalIsOpen}
        onCancel={handleNewProjectEnd}
      />

      <EditProjectModal
        open={editProjectModalIsOpen}
        onCancel={handleEditProjectEnd}
        workSpace={workSpaceToEdit}
      />
      <DeleteProjectModal
        workSpace={workSpaceToEdit}
        open={deleteProjectModalIsOpen}
        onCancel={handleDeleteProjectEnd}
      />
    </div>
  );
};

export default ProjectSelector;
