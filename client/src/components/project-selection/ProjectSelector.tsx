import React, { useState } from "react";
import {
  deleteProject,
  postAddNewProject,
  ProjectType,
  getChangeBetweenProjects,
  putEditProject,
  getProjects,
} from "../../api/api";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
import ProjectItem from "./ProjectItem";
import NewProjectModal from "./NewProjectModal";
import EditProjectModal from "./EditProjectModal";
import NewProjectItem from "./NewProjectItem";
const ProjectSelector = () => {
  const [projects] = useState<ProjectType[]>(getProjects());

  const [newProjectModalIsOpen, setNewProjectModalIsOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const [editProjectModalIsOpen, setEditProjectModalIsOpen] = useState(false);
  const [editedProjectName, setEditedProjectName] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState("");

  const { show: showSnackbar, component: snackBar } = useSnackbar();

  //remove from selected project edit and delete?
  // when remove project open pop up window for confirm delete

  const handleChangeProject = (projectClick: SelectChangeEvent<string>) => {
    console.log(projectClick);
    getChangeBetweenProjects(projectClick.target.value); //api call
  };

  const handleDeleteProject = (e: React.MouseEvent, projectName: string) => {
    e.stopPropagation();
    deleteProject(projectName); //api call
  };

  const handleNewProjectSave = () => {
    if (
      newProjectName === "" ||
      projects.find((project) => project.name === newProjectName)
    ) {
      showSnackbar("Name cannot be empty or already exists", "error");
      return;
    }
    postAddNewProject(newProjectName); //api call

    setNewProjectName("");
    setNewProjectModalIsOpen(false);
  };
  const handleNewProjectCancel = () => {
    setNewProjectName("");
    setNewProjectModalIsOpen(false);
  };

  const handleEditProject = (e: React.MouseEvent, projectName: string) => {
    e.stopPropagation();
    setSelectedProjectName(projectName);
    setEditedProjectName(projectName);
    setEditProjectModalIsOpen(true);
  };

  const handleEditedProjectSave = () => {
    if (
      editedProjectName === "" ||
      editedProjectName === selectedProjectName ||
      projects.find((project) => project.name === editedProjectName)
    ) {
      showSnackbar("Name cannot be empty or the same", "error");
      return;
    }
    putEditProject(editedProjectName, selectedProjectName); //api call

    handleEditedProjectEnd();
  };

  const handleEditedProjectEnd = () => {
    setEditedProjectName("");
    setSelectedProjectName("");
    setEditProjectModalIsOpen(false);
  };

  return (
    <div>
      {snackBar}
      <FormControl fullWidth size="small">
        <InputLabel>NameSpaces</InputLabel>
        <Select
          style={{ width: "200px" }}
          value={
            projects.find((project) => project.isOpen === true)?.name || ""
          }
          label="project"
          onChange={handleChangeProject}
        >
          <NewProjectItem setNewProjectModalIsOpen={setNewProjectModalIsOpen} />
          {projects.map((project: ProjectType) => {
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
        onCancel={handleNewProjectCancel}
        onSave={handleNewProjectSave}
        setNewProjectName={setNewProjectName}
      />

      <EditProjectModal
        open={editProjectModalIsOpen}
        onCancel={handleEditedProjectEnd}
        onSave={handleEditedProjectSave}
        setEditedProjectName={setEditedProjectName}
        EditedProjectName={editedProjectName}
      />
    </div>
  );
};

export default ProjectSelector;
