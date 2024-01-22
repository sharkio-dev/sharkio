import { MenuItem } from "@mui/material";
import { AiOutlinePlus } from "react-icons/ai";
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
      <div className="flex items-center text-sm hover:text-green-500 gap-2">
        <AiOutlinePlus className="text-xl" />
        Create Workspace
      </div>
    </MenuItem>
  );
};

export default NewWorkspaceItem;
