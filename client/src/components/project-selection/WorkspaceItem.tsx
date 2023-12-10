import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { workSpaceType } from "../../stores/workspaceStore";

interface projectItemProps {
  workspace: workSpaceType;
  handleEditWorkspace: (e: React.MouseEvent, workSpace: workSpaceType) => void;
  handleDeleteWorkspace: (e: React.MouseEvent, workSpace: workSpaceType) => void;
}
const WorkspaceItem: React.FC<projectItemProps> = ({
  workspace,
  handleEditWorkspace,
  handleDeleteWorkspace,
}: any) => {
  return (
    <div className="flex items-center w-full justify-between">
      <div>{workspace.name}</div>
      <div className="flex items-end space-x-2">
        <AiOutlineEdit
          className="text-amber-200 text-lg"
          onClick={(e: React.MouseEvent) => handleEditWorkspace(e, workspace)}
        />
        <AiOutlineDelete
          className="text-red-200 text-lg"
          onClick={(e: React.MouseEvent) => handleDeleteWorkspace(e, workspace)}
        />
      </div>
    </div>
  );
};

export default WorkspaceItem;
