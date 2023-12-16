import { AiOutlinePlus } from "react-icons/ai";
import { MenuItem } from "@mui/material";

interface NewProjectItemProps {
  setIsModalOpen: () => void;
}
const NewWorkspaceItem: React.FC<NewProjectItemProps> = ({
  setIsModalOpen,
}) => {
  return (
    <MenuItem onClick={setIsModalOpen} value="New workspace">
      <div className="flex items-center text-green-300 hover:text-green-500 gap-1 font-bold ">
        Add workspace
        <AiOutlinePlus className="text-xl" />
      </div>
    </MenuItem>
  );
};

export default NewWorkspaceItem;
