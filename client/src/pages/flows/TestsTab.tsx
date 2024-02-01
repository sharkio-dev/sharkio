import { AiOutlineDelete } from "react-icons/ai";
import TabPanel from "@mui/lab/TabPanel";
import { TextButton } from "../../components/TextButton";
import { selectIconByMethod } from "../sniffers/selectIconByMethod";
import { MdChevronRight } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useFlowStore, NodeType } from "../../stores/flowStore";
import { useEffect } from "react";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { useSniffersStore } from "../../stores/sniffersStores";

const Step = ({ step }: { step: NodeType }) => {
  const navigate = useNavigate();
  const { sniffers } = useSniffersStore();
  const sniffer = sniffers.find((s) => s.id === step.proxyId);
  const { flowId } = useParams();

  return (
    <div className="flex flex-col border border-border-color p-2 px-4 mt-2 shadow-md hover:border-blue-400 cursor-grab rounded-md min-h-[48px] active:cursor-grabbing justify-center">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col justify-center">
          <div className="flex flex-row items-center space-x-2">
            <div className="text-lg font-bold">{step.name}</div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            {selectIconByMethod(step.method)}
            <div className="text-sm text-gray-400">{sniffer?.name}</div>
            <div className="text-sm text-gray-400 truncate max-w-[75ch]">
              {step.url}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <AiOutlineDelete className=" active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md" />
          <MdChevronRight
            className=" active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md"
            onClick={() => navigate("/flows/" + flowId + "/tests/" + step.id)}
          />
        </div>
      </div>
    </div>
  );
};

export const TestsTab: React.FC = () => {
  const { nodes, loadNodes, isNodesLoading, postNode } = useFlowStore();
  const { flowId } = useParams();

  useEffect(() => {
    if (!flowId) return;
    loadNodes(flowId);
  }, [flowId]);

  return (
    <TabPanel value="1" style={{ padding: 0, height: "100%" }}>
      <TextButton
        text="Add Test"
        onClick={() => {
          if (!flowId) return;
          postNode(flowId, {
            name: "New Test",
            url: "/",
            method: "GET",
            headers: {},
            body: "",
            assertions: [],
            proxyId: "1fc60d49-7c13-48ab-bcdc-3717ff40ffac",
          });
        }}
      />
      {isNodesLoading ? (
        <LoadingIcon />
      ) : (
        nodes.map((step) => <Step step={step} />)
      )}
    </TabPanel>
  );
};
