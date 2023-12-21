import { AiOutlinePlus } from "react-icons/ai";
import { MenuItem } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const NewWorkspaceItem = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleAddWorkspace = () => {
    const params = new URLSearchParams(location.search);
    params.set("addWorkspace", "true");
    location.search = params.toString();
    navigate(location);
  };

  return (
    <MenuItem onClick={handleAddWorkspace} value="New workspace">
      <div className="flex items-center text-green-300 hover:text-green-500 gap-1 font-bold ">
        Add workspace
        <AiOutlinePlus className="text-xl" />
      </div>
    </MenuItem>
  );
};

export default NewWorkspaceItem;
