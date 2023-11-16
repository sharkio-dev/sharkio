import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { MenuItem } from "@mui/material";

const ProjectItem = ({
  project,
  handleEditProject,
  handleDeleteProject,
}: any) => {
  return (
      <div className="flex items-center w-full justify-between">
        <div>{project.name}</div>
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
      </div>
   
  );
};

export default ProjectItem;
