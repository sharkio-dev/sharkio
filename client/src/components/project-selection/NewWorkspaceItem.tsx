import { AiOutlinePlus } from "react-icons/ai";
import { MenuItem } from "@mui/material";
import { openModal } from "./WorkspaceSelector";

interface NewProjectItemProps {
  setModalIsOpen: React.Dispatch<React.SetStateAction<openModal>>;
}
const NewWorkspaceItem: React.FC<NewProjectItemProps> = ({
  setModalIsOpen,
}) => {
  const handleAddNewProject = () => {
    setModalIsOpen('create');
  };

  return (
    <MenuItem onClick={() => handleAddNewProject()} value="New workspace">
      <AiOutlinePlus></AiOutlinePlus> add workSpace
    </MenuItem>
  );
};

export default NewWorkspaceItem;
