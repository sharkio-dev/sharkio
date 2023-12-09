import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { workSpaceType } from "../../api/api";

interface projectItemProps {
  project: workSpaceType;
  handleEditProject: (e: React.MouseEvent, workSpace: workSpaceType) => void;
  handleDeleteProject: (e: React.MouseEvent, workSpace: workSpaceType) => void;
}
const ProjectItem: React.FC<projectItemProps> = ({
  project: workSpace,
  handleEditProject,
  handleDeleteProject,
}: any) => {
  return (
    <div className="flex items-center w-full justify-between">
      <div>{workSpace.name}</div>
      <div className="flex items-end space-x-2">
        <AiOutlineEdit
          className="text-amber-200 text-lg"
          onClick={(e: React.MouseEvent) => handleEditProject(e, workSpace)}
        />
        <AiOutlineDelete
          className="text-red-200 text-lg"
          onClick={(e: React.MouseEvent) => handleDeleteProject(e, workSpace)}
        />
      </div>
    </div>
  );
};

export default ProjectItem;
