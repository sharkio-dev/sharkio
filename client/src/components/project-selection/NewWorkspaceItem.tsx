import { AiOutlinePlus } from "react-icons/ai";
import { MenuItem } from "@mui/material";

interface NewProjectItemProps {
  setNewProjectModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const NewWorkspaceItem: React.FC<NewProjectItemProps> = ({
  setNewProjectModalIsOpen,
}) => {
  const handleAddNewProject = () => {
    setNewProjectModalIsOpen(true);
  };

  return (
    <MenuItem onClick={() => handleAddNewProject()} value="New Project">
      <AiOutlinePlus></AiOutlinePlus> add workSpace
    </MenuItem>
  );
};

export default NewWorkspaceItem;
