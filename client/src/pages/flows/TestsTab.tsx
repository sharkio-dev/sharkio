import { AiOutlineDelete } from "react-icons/ai";
import TabPanel from "@mui/lab/TabPanel";
import { TextButton } from "../../components/TextButton";
import { selectIconByMethod } from "../sniffers/selectIconByMethod";
import { MdChevronRight } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { FlowStep } from "./flowPage";
import { useFlowStore } from "../../stores/flowStore";
import { useEffect } from "react";
import { LoadingIcon } from "../sniffers/LoadingIcon";

const Step = ({ step }: { step: FlowStep }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col border border-border-color p-2 px-4 mt-2 shadow-md hover:border-blue-400 cursor-grab rounded-md min-h-[48px] active:cursor-grabbing justify-center">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col justify-center">
          <div className="flex flex-row items-center space-x-2">
            <div className="text-lg font-bold">{step.name}</div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            {selectIconByMethod(step.method)}
            <div className="text-sm text-gray-400">ProxyName</div>
            <div className="text-sm text-gray-400 truncate max-w-[75ch]">
              {step.url}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <AiOutlineDelete className=" active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md" />
          <MdChevronRight
            className=" active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md"
            onClick={() => navigate("/flows/123/tests/123")}
          />
        </div>
      </div>
    </div>
  );
};

export const TestsTab: React.FC = () => {
  const { nodes, loadNodes, isNodesLoading } = useFlowStore();
  const { flowId } = useParams();

  useEffect(() => {
    if (!flowId) return;
    loadNodes(flowId);
  }, [flowId]);

  return (
    <TabPanel value="1" style={{ padding: 0, height: "100%" }}>
      <TextButton text="Add Test" onClick={() => {}} />
      {isNodesLoading ? (
        <LoadingIcon />
      ) : (
        nodes.map((step) => <Step step={step} />)
      )}
    </TabPanel>
  );
};
