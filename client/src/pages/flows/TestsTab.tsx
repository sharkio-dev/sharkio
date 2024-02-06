import { AiOutlineDelete } from "react-icons/ai";
import TabPanel from "@mui/lab/TabPanel";
import { TextButton } from "../../components/TextButton";
import { selectIconByMethod } from "../sniffers/selectIconByMethod";
import { MdChevronRight } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useFlowStore, NodeType } from "../../stores/flowStore";
import { useEffect, useState } from "react";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { useSniffersStore } from "../../stores/sniffersStores";
import GenericEditingModal from "../../components/project-selection/GenericEditingModal";
import { useSnackbar } from "../../hooks/useSnackbar";
import { EditableNameField } from "./EditableNameProps";
import { TextField } from "@mui/material";
import { ProxySelector } from "../sniffers/SniffersSideBar";
import React from "react";

const Step = ({
  step,
  stepIds,
  index,
  dragResponseRef,
  dragOverResponseRef,
}: {
  step: NodeType;
  stepIds: string[];
  index: number;
  dragResponseRef: any;
  dragOverResponseRef: any;
}) => {
  const navigate = useNavigate();
  const { sniffers } = useSniffersStore();
  const sniffer = sniffers.find((s) => s.id === step.proxyId);
  const { flowId } = useParams();
  const [stepName, setStepName] = useState(step.name);
  const { putNode, isNodeLoading } = useFlowStore();
  const { reorderNodes } = useFlowStore();

  useEffect(() => {
    setStepName(step.name);
  }, [step.name]);

  const onStepClick = () => {
    navigate("/flows/" + flowId + "/tests/" + step.id);
  };

  const handleSort = () => {
    if (!flowId) return;

    const newNodesIds = stepIds ? [...stepIds] : [];
    const draggedResponse = newNodesIds[dragResponseRef.current];
    newNodesIds.splice(dragResponseRef.current, 1);
    newNodesIds.splice(dragOverResponseRef.current, 0, draggedResponse);
    reorderNodes(flowId, newNodesIds);
  };

  return (
    <div
      className="flex flex-col border border-border-color p-2 px-4 mt-2 shadow-md hover:border-blue-400 cursor-grab rounded-md min-h-[48px] active:cursor-grabbing justify-center"
      key={`${index}-${step.id}`}
      draggable
      onDragStart={() => (dragResponseRef.current = index)}
      onDragEnter={() => (dragOverResponseRef.current = index)}
      onDragEnd={handleSort}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row w-full" onClick={onStepClick}>
          <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
            <EditableNameField
              isLoading={isNodeLoading}
              name={stepName}
              handleNameChange={setStepName}
              handleSaveClicked={() => {
                putNode(flowId as string, { ...step, name: stepName });
              }}
            />
            <div className="flex flex-row items-center space-x-2">
              {selectIconByMethod(step.method)}
              <div className="text-sm text-gray-400">{sniffer?.name}</div>
              <div className="text-sm text-gray-400 truncate max-w-[75ch]">
                {step.url}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <FlowNodeDeleteButton flowId={flowId as string} nodeId={step.id} />
          <MdChevronRight
            className=" active:scale-110 text-xl cursor-pointer hover:bg-border-color rounded-md"
            onClick={onStepClick}
          />
        </div>
      </div>
    </div>
  );
};

const FlowNodeDeleteButton = ({
  flowId,
  nodeId,
}: {
  flowId: string;
  nodeId: string;
}) => {
  const { deleteNode } = useFlowStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flowName, setFlowName] = useState("");
  const { nodes } = useFlowStore();
  const node = nodes.find((node) => node.id === nodeId);
  const { show: showSnackbar, component: snackBar } = useSnackbar();

  const handleFlowNameChange = (event: any) => {
    setFlowName(event.target.value);
  };

  const handleDeleteFlow = () => {
    if (flowName !== node?.name) {
      showSnackbar(
        "Flow name does not match. Please enter the flow name to delete.",
        "error",
      );
      return;
    }
    deleteNode(flowId, nodeId);
    setIsModalOpen(false);
  };

  return (
    <div>
      {snackBar}
      <GenericEditingModal
        modalProps={{
          open: isModalOpen,
          onClose: () => {
            setIsModalOpen(false);
          },
        }}
        paperHeadLine="Delete Flow"
        acceptButtonValue="Delete"
        acceptButtonProps={{
          onClick: () => {
            setIsLoading(true);
            handleDeleteFlow();
            setIsLoading(false);
          },
          style: { color: "red" },
        }}
        cancelButtonProps={{
          onClick: () => {
            setIsModalOpen(false);
          },
        }}
        textFieldProps={{
          label: `Enter "${node?.name}" to delete`,
          placeholder: `Enter "${node?.name}" to delete`,
          onChange: (event: any) => {
            handleFlowNameChange(event);
          },
        }}
        isLoading={isLoading}
      />
      <AiOutlineDelete
        className="text-md cursor-pointer hover:bg-border-color rounded-md"
        onClick={(e: any) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
      />
    </div>
  );
};

export const TestsTab: React.FC = () => {
  const { nodes, loadNodes, isNodesLoading } = useFlowStore();
  const { flowId } = useParams();
  const dragResponseRef = React.useRef<number>(0);
  const dragOverResponseRef = React.useRef<number>(0);

  useEffect(() => {
    if (!flowId) return;
    loadNodes(flowId, true);
  }, [flowId]);

  const nodesIds = nodes.map((node) => node.id);

  return (
    <TabPanel value="1" style={{ padding: 0, height: "100%" }}>
      <AddTestButton />
      {isNodesLoading ? (
        <LoadingIcon />
      ) : (
        nodes.map((step, index) => (
          <Step
            step={step}
            stepIds={nodesIds}
            index={index}
            key={step.id}
            dragOverResponseRef={dragOverResponseRef}
            dragResponseRef={dragResponseRef}
          />
        ))
      )}
    </TabPanel>
  );
};

const AddTestButton = () => {
  const { flowId } = useParams();
  const { postNode } = useFlowStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stepName, setStepName] = useState("");
  const [proxyId, setProxyId] = useState("");
  const { show: showSnackbar, component: snackBar } = useSnackbar();

  const onAddTest = () => {
    if (!flowId) return;
    if (!stepName) {
      showSnackbar("Please enter step name", "warning");
      return;
    }
    if (!proxyId) {
      showSnackbar("Please select a proxy", "warning");
      return;
    }

    postNode(flowId, {
      name: stepName,
      url: "/",
      method: "GET",
      headers: {},
      body: "",
      assertions: [],
      proxyId: proxyId,
    }).then(() => {
      setIsModalOpen(false);
      setStepName("");
      setProxyId("");
      showSnackbar("Step added successfully", "success");
    });
  };
  return (
    <>
      {snackBar}
      <TextButton text="Add Step" onClick={() => setIsModalOpen(true)} />
      <GenericEditingModal
        modalProps={{
          open: isModalOpen,
          onClose: () => {
            setIsModalOpen(false);
          },
        }}
        paperHeadLine="Add Step"
        acceptButtonValue="Add"
        acceptButtonProps={{
          onClick: onAddTest,
        }}
        cancelButtonProps={{
          onClick: () => {
            setIsModalOpen(false);
          },
        }}
        isLoading={false}
      >
        <TextField
          label="Enter step name"
          placeholder="Enter step name"
          size="small"
          value={stepName}
          onChange={(e) => setStepName(e.target.value)}
        />
        <ProxySelector
          snifferId={proxyId}
          onSnifferSelected={(id) => setProxyId(id)}
        />
      </GenericEditingModal>
    </>
  );
};
