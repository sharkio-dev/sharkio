import { AiOutlinePlus } from "react-icons/ai";
import { MenuItem } from "@mui/material";
const NewProjectItem = ({ setNewProjectModalIsOpen }: any) => {
  const handleAddNewProject = (e: React.MouseEvent) => {
    e.stopPropagation(); // not working
    setNewProjectModalIsOpen(true);
  };

  return (
    <MenuItem
      onClick={(e: React.MouseEvent) => handleAddNewProject(e)}
      value="New Project"
    >
      <AiOutlinePlus></AiOutlinePlus> New Project
    </MenuItem>
  );
};

export default NewProjectItem;
