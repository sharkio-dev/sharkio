import React, { useState } from "react";
import {
  ProjectType,
  getChangeBetweenProjects,
  getProjects,
} from "../../api/api";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import ProjectItem from "./ProjectItem";
import NewProjectModal from "./NewProjectModal";
import EditProjectModal from "./EditProjectModal";
import NewProjectItem from "./NewProjectItem";
import { DeleteProjectModal } from "./DeleteProjectModal";
const ProjectSelector = () => {
  // const [projects] = useState<ProjectType[]>(getProjects());

  const [newProjectModalIsOpen, setNewProjectModalIsOpen] = useState(false);
  const [editProjectModalIsOpen, setEditProjectModalIsOpen] = useState(false);
  const [deleteProjectModalIsOpen, setDeleteProjectModalIsOpen] =
    useState(false);

  const [ProjectToEditName, setProjectToEditName] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState(
    getProjects().find((project) => project.isOpen)?.name || ""
  );


  //remove from selected project edit and delete?
  // when remove project open pop up window for confirm delete
  // add id to every project?

  const handleChangeProject = (projectClick: SelectChangeEvent<string>) => {
    setSelectedProjectName(projectClick.target.value);
    getChangeBetweenProjects(projectClick.target.value); //api call
  };

  const handleNewProjectEnd = () => {
    setNewProjectModalIsOpen(false);
  };

  const handleEditProject = (e: React.MouseEvent, projectName: string) => {
    e.stopPropagation();
    setProjectToEditName(projectName);
    setEditProjectModalIsOpen(true);
  };

  const handleEditProjectEnd = () => {
    setProjectToEditName(" ");
    setEditProjectModalIsOpen(false);
  };

  const handleDeleteProject = (e: React.MouseEvent, projectName: string) => {
    e.stopPropagation();
    setDeleteProjectModalIsOpen(true);
    setProjectToEditName(projectName);
  };

  const handleDeleteProjectEnd = () => {
    setDeleteProjectModalIsOpen(false);
    setProjectToEditName("");
  };

  return (
    <div>
      <FormControl fullWidth size="small">
        <InputLabel>NameSpaces</InputLabel>
        <Select
          style={{ width: "200px" }}
          value={selectedProjectName || " "}
          label="project"
          onChange={handleChangeProject}
        >
          <NewProjectItem setNewProjectModalIsOpen={setNewProjectModalIsOpen} />
          {getProjects().map((project: ProjectType) => {
            return (
              <MenuItem key={project.id} value={project.name}>
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
        ProjectToEditName={ProjectToEditName}
      />
      <DeleteProjectModal
        projectName={ProjectToEditName}
        open={deleteProjectModalIsOpen}
        onCancel={handleDeleteProjectEnd}
      />
    </div>
  );
};

export default ProjectSelector;
