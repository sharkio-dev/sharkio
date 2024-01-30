import {
  AiOutlineDelete,
  AiOutlinePlayCircle,
  AiOutlinePlus,
} from "react-icons/ai";
import { Flow, useFlowStore } from "../../stores/flowStore";
import { useEffect } from "react";
import { LoadingIcon } from "../sniffers/LoadingIcon";

const NewFlowButton = () => {
  return (
    <div className="border-b border-border-color pb-2 mb-2">
      <div
        className={`flex flex-row w-full hover:bg-primary  cursor-pointer active:bg-tertiary items-center rounded-md`}
      >
        <div
          className={`flex text-sm max-w-full overflow-ellipsis whitespace-nowrap items-center`}
        >
          <AiOutlinePlus className="text-blue-500 h-8 w-8 p-1" />
          New Flow
        </div>
      </div>
    </div>
  );
};

interface FlowSideBarProps {
  flows: Flow[];
  selectedFlow?: Flow;
  setSelectedFlow?: (flow: Flow) => void;
}

const FlowsSideBar: React.FC<FlowSideBarProps> = ({ flows }) => {
  return (
    <>
      {flows.map((flow) => (
        <div
          className={`flex p-1 px-2 flex-row w-full items-center rounded-md space-x-4 hover:bg-primary cursor-pointer active:bg-tertiary`}
        >
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex w-full text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
              {flow.name}
            </div>
            <div className="flex flex-row items-center space-x-2">
              <AiOutlineDelete
                className="text-sm cursor-pointer hover:bg-border-color rounded-md"
                onClick={(e: any) => e.stopPropagation()}
              />
              <AiOutlinePlayCircle className="flex text-sm text-green-400 cursor-pointer hover:scale-105 active:scale-100 transition-transform" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export const FlowSideBar: React.FC = () => {
  const { flows, loadFlows, isFlowsLoading } = useFlowStore();

  useEffect(() => {
    loadFlows();
  }, []);

  return (
    <div className="flex flex-col space-y-4 px-2">
      <div className="flex flex-col">
        <div className="text-2xl font-bold mb-2">Flows</div>
        <NewFlowButton />
        {isFlowsLoading ? <LoadingIcon /> : <FlowsSideBar flows={flows} />}
      </div>
    </div>
  );
};
