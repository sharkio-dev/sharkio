import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { workSpaceType } from "../../stores/workspaceStore";

interface projectItemProps {
  workspace: workSpaceType;
  handleEditWorkspace: (e: React.MouseEvent, workSpace: workSpaceType) => void;
  handleDeleteWorkspace: (
    e: React.MouseEvent,
    workSpace: workSpaceType,
  ) => void;
}
const WorkspaceItem: React.FC<projectItemProps> = ({
  workspace,
  handleEditWorkspace,
  handleDeleteWorkspace,
}: any) => {
  return (
    <>
      <div className="flex items-center w-full justify-between">
        <div className="font-bold hover:text-green-100">{workspace.name}</div>
        <div className="flex items-end space-x-2">
          <AiOutlineEdit
            className="text-amber-500 text-lg hover:text-amber-700"
            onClick={(e: React.MouseEvent) => handleEditWorkspace(e, workspace)}
          />
          <AiOutlineDelete
            className="text-red-500 text-lg hover:text-red-700"
            onClick={(e: React.MouseEvent) =>
              handleDeleteWorkspace(e, workspace)
            }
          />
        </div>
      </div>
    </>
  );
};

export default WorkspaceItem;
