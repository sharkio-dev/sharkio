import React, { useState } from "react";
import {
  DeleteProject,
  PostAddNewProject,
  ProjectType,
  GetChangeBetweenProjects,
  PutEditProject,
  getProjects,
} from "../../api/api";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
import ProjectItem from "./ProjectItem";
import NewProjectModal from "./NewProjectModal";
import EditProjectModal from "./EditProjectModal";
import NewProjectItem from "./NewProjectItem";
const ProjectSelector = () => {
  const [projects, setProjects] = useState<ProjectType[]>(getProjects());

  const [newProjectModalIsOpen, setNewProjectModalIsOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const [editProjectModalIsOpen, setEditProjectModalIsOpen] = useState(false);
  const [editedProjectName, setEditedProjectName] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState("");

  const { show: showSnackbar, component: snackBar } = useSnackbar();

  //remove from selected project edit and delete

  //Change between projects
  const handleChangeProject = (projectClick: any) => {
    console.log("projectClick");
    GetChangeBetweenProjects(projectClick); //api call
    // setProjects((projects) => {
    //   const updatedProjects = projects.map((project) => ({
    //     ...project,
    //     isOpen: project.name === projectClick.target.value,
    //   }));

    //   console.log(updatedProjects); // Log for checking
    //   return updatedProjects;
    // });
  };

  const handleDeleteProject = (e: React.MouseEvent, projectName: string) => {
    e.stopPropagation();
    DeleteProject(e, projectName); //api call

    // console.log("delete project", projectName);
    // setProjects((prevProjects) =>
    //   prevProjects.filter((project) => project.name !== projectName)
    // );
  };

  //Add new project functions
  const handleNewProjectSave = () => {
    // Add new project logic here
    if (
      newProjectName === "" ||
      projects.find((project) => project.name === newProjectName)
    ) {
      showSnackbar("Name cannot be empty or already exists", "error");
      return;
    }
    PostAddNewProject(newProjectName); //api call

    // const newProject: ProjectType = {
    //   name: newProjectName,
    //   id: String(projects[projects.length - 1].id + 1),
    //   isOpen: true,
    // };

    // setProjects((prevProjects) => [...prevProjects, newProject]);
    setNewProjectName("");
    setNewProjectModalIsOpen(false);
  };
  const handleNewProjectCancel = () => {
    setNewProjectName("");
    setNewProjectModalIsOpen(false);
  };

  //Edit project functions
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
    PutEditProject(editedProjectName, selectedProjectName); //api call
    // projects.map((project) => {
    //   if (project.name === selectedProjectName) {
    //     project.name = editedProjectName;
    //   }
    // });

    setNewProjectName("");
    setSelectedProjectName("");
    setEditProjectModalIsOpen(false);
  };

  const handleEditedProjectCancel = () => {
    setEditedProjectName("");
    setSelectedProjectName("");
    setEditProjectModalIsOpen(false);
  };

  return (
    <div>
      {snackBar}
      <FormControl fullWidth size="small">
        <InputLabel id="demo-simple-select-label ">Projects manager</InputLabel>
        <Select
          style={{ width: "200px" }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={
            projects.find((project) => project.isOpen === true)?.name || ""
          }
          label="projects manager"
          onChange={handleChangeProject}
        >
          <NewProjectItem setNewProjectModalIsOpen={setNewProjectModalIsOpen} />
          {projects.map(
            (project: { name: string; id: string; isOpen: boolean }) => {
              return (
                <MenuItem key={project.id} value={project.name}>
                  <ProjectItem
                    project={project}
                    handleEditProject={handleEditProject}
                    handleDeleteProject={handleDeleteProject}
                  />
                </MenuItem>
              );
            }
          )}
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
        onCancel={handleEditedProjectCancel}
        onSave={handleEditedProjectSave}
        setEditedProjectName={setEditedProjectName}
        EditedProjectName={editedProjectName}
      />
    </div>
  );
};

export default ProjectSelector;
