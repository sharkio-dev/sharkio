import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { ProjectType, getProjects } from "../../api/api";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Modal,
  Button,
  TextField,
  Paper,
} from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
const ProjectSelector = () => {
  //just for development
  const [projects, setProjects] = useState<ProjectType[]>(getProjects());
  const [newProjectModalIsOpen, setNewProjectModalIsOpen] = useState(false);
  const [editProjectModalIsOpen, setEditProjectModalIsOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [editedProjectName, setEditedProjectName] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState("");

  const { show: showSnackbar, component: snackBar } = useSnackbar();

  //after all work and check with maintainers move to smaller components

  //Change between projects
  const handleChangeProject = (projectClick: any) => {
    setProjects((projects) => {
      const updatedProjects = projects.map((project) => ({
        ...project,
        isOpen: project.name === projectClick.target.value,
      }));

      console.log(updatedProjects); // Log for checking
      return updatedProjects;
    });
  };

  //Delete project
  const handleDeleteProject = (e: React.MouseEvent, projectName: string) => {
    // Delete project logic here
    e.stopPropagation();

    console.log("delete project", projectName);
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.name !== projectName)
    );
  };

  //Add new project functions
  const handleAddNewProject = (e: React.MouseEvent) => {
    console.log("add new project");
    e.stopPropagation(); // not working
    setNewProjectModalIsOpen(true);
  };
  const handleNewProjectSave = () => {
    // Add new project logic here
    if (
      newProjectName === "" ||
      projects.find((project) => project.name === newProjectName)
    ) {
      showSnackbar("Name cannot be empty or already exists", "error");
      return;
    }
    const newProject: ProjectType = {
      name: newProjectName,
      id: String(projects[projects.length - 1].id + 1),
      isOpen: true,
    };

    setProjects((prevProjects) => [...prevProjects, newProject]);
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
    console.log("edit project", projectName);
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
    projects.map((project) => {
      if (project.name === selectedProjectName) {
        project.name = editedProjectName;
      }
    });

    setNewProjectName("");
    setSelectedProjectName("");
    setEditProjectModalIsOpen(false);
  };

  const handleEditedProjectCencel = () => {
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
          <MenuItem
            onClick={(e: React.MouseEvent) => handleAddNewProject(e)}
            value="New Project"
          >
            <AiOutlinePlus></AiOutlinePlus> New Project
          </MenuItem>
          {projects.map(
            (project: { name: string; id: string; isOpen: boolean }) => {
              return (
                <MenuItem
                  className="flex items-center space-x-4"
                  key={project.id}
                  value={project.name}
                >
                  <div>{project.name}</div>
                  {project.name !==
                  projects.find((project) => project.isOpen === true)?.name ? (
                    <>
                      <div className="flex items-end space-x-2">
                        <AiOutlineEdit
                          className="text-amber-200 text-lg"
                          onClick={(e: React.MouseEvent) =>
                            handleEditProject(e, project.name)
                          }
                        />
                        <AiOutlineDelete
                          className="text-red-200 text-lg"
                          onClick={(e: React.MouseEvent) =>
                            handleDeleteProject(e, project.name)
                          }
                        />
                      </div>
                    </>
                  ) : null}
                </MenuItem>
              );
            }
          )}
        </Select>
      </FormControl>
      <Modal
        open={newProjectModalIsOpen}
        onClose={handleNewProjectCancel}
        closeAfterTransition
        className="flex justify-center items-center border-0"
      >
        <Paper className="flex flex-col p-4 w-96 rounded-sm">
          <div className="text-2xl font-bold">Add New Project</div>
          <div className="w-full border-b-[0.05px] my-4" />
          <div className="flex flex-col space-y-2">
            <TextField
              label={"Project Name"}
              placeholder="Project Name"
              onChange={(e) => setNewProjectName(e.target.value)}
              inputProps={{ maxLength: 25 }}
            />
          </div>
          <div className="flex flex-row justify-start  mt-4">
            <Button onClick={handleNewProjectSave}>Add</Button>
            <Button onClick={handleNewProjectCancel}>Cancel</Button>
          </div>
        </Paper>
      </Modal>
      <Modal
        open={editProjectModalIsOpen}
        onClose={handleEditedProjectCencel}
        closeAfterTransition
        className="flex justify-center items-center border-0"
      >
        <Paper className="flex flex-col p-4 w-96 rounded-sm">
          <div className="text-2xl font-bold">edit project</div>
          <div className="w-full border-b-[0.05px] my-4" />
          <div className="flex flex-col space-y-2">
            <TextField
              label={"Project Name"}
              placeholder="Project Name"
              value={editedProjectName}
              onChange={(e) => setEditedProjectName(e.target.value)}
              inputProps={{ maxLength: 25 }}
            />
          </div>
          <div className="flex flex-row justify-start  mt-4">
            <Button onClick={handleEditedProjectSave}>Add</Button>
            <Button onClick={handleEditedProjectCencel}>Cancel</Button>
          </div>
        </Paper>
      </Modal>
    </div>
  );
};

export default ProjectSelector;

// add edit and remove buttons? to every project
// +{" "}
// <button
//   style={{ color: "red" }}
//   onClick={() => handleRemoveProject(project.name)}
// >
//   garbage icon
// </button>

// const handleRemoveProject = (projectName: string) => {
//   setProjects((prevProjects) =>
//     prevProjects.filter((project) => project.name !== projectName)
//   );
// };
