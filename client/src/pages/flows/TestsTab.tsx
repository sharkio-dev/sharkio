import TabPanel from "@mui/lab/TabPanel";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { GiSharkFin } from "react-icons/gi";
import { MdChevronRight } from "react-icons/md";
import { PiGraphLight } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import { TextButton } from "../../components/TextButton";
import GenericEditingModal from "../../components/project-selection/GenericEditingModal";
import { useSnackbar } from "../../hooks/useSnackbar";
import { NodeType, useFlowStore } from "../../stores/flowStore";
import { useSniffersStore } from "../../stores/sniffersStores";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { ProxySelector, SideBarItem } from "../sniffers/SniffersSideBar";
import { selectIconByMethod } from "../sniffers/selectIconByMethod";
import { EditableNameField } from "./EditableNameProps";

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
  const { reorderNodes, flows } = useFlowStore();

  useEffect(() => {
    setStepName(step.name);
  }, [step.name]);

  const onStepClick = () => {
    if (step.type === "http") {
      navigate("/flows/" + step.flowId + "/tests/" + step.id);
    } else {
      navigate("/flows/" + step.subFlowId);
    }
  };

  const handleSort = () => {
    if (!flowId) return;

    const newNodesIds = stepIds ? [...stepIds] : [];
    const draggedResponse = newNodesIds[dragResponseRef.current];
    newNodesIds.splice(dragResponseRef.current, 1);
    newNodesIds.splice(dragOverResponseRef.current, 0, draggedResponse);
    reorderNodes(flowId, newNodesIds);
  };

  const flowName = flows.find((f) => f.id === step.subFlowId)?.name;

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
        <div className="flex flex-row w-full" onClick={() => onStepClick()}>
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
              {step.type === "http" ? (
                <>
                  {selectIconByMethod(step.method)}
                  <div className="text-sm text-gray-400">{sniffer?.name}</div>
                  <div className="text-sm text-gray-400 truncate max-w-[75ch]">
                    {step.url}
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center space-x-2">
                  <PiGraphLight /> <div>{flowName}</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center space-x-2">
          <FlowNodeDeleteButton flowId={flowId as string} nodeId={step.id} />
          <MdChevronRight
            className=" active:scale-110 text-xl cursor-pointer hover:bg-border-color rounded-md"
            onClick={() => onStepClick()}
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
  const [subFlowId, setSubFlowId] = useState<string | undefined>(undefined);
  const [proxyId, setProxyId] = useState<string | undefined>(undefined);
  const [type, setType] = useState<"http" | "subflow">("http");
  const { show: showSnackbar, component: snackBar } = useSnackbar();

  const onAddTest = () => {
    if (!flowId) return;
    if (!stepName) {
      showSnackbar("Please enter step name", "warning");
      return;
    }

    if (type === "http" && !proxyId) {
      showSnackbar("Please select a proxy", "warning");
      return;
    }

    if (type === "subflow" && !subFlowId) {
      showSnackbar("Please select a subflow", "warning");
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
      subFlowId,
      type,
    }).then(() => {
      setIsModalOpen(false);
      setStepName("");
      setProxyId(undefined);
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
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel>Type</InputLabel>
          <Select value={type} label="Type">
            <MenuItem
              key={"http"}
              onClick={() => {
                setType("http");
              }}
              value={"http"}
            >
              Http
            </MenuItem>
            <MenuItem
              key={"subflow"}
              onClick={() => {
                setType("subflow");
              }}
              value={"subflow"}
            >
              Subflow
            </MenuItem>
          </Select>
        </FormControl>
        {type === "http" && (
          <ProxySelector
            snifferId={proxyId}
            onSnifferSelected={(id) => setProxyId(id)}
          />
        )}
        {type === "subflow" && (
          <FlowSelector
            flowId={subFlowId}
            onFlowSelected={(id) => setSubFlowId(id)}
          />
        )}
      </GenericEditingModal>
    </>
  );
};

export const FlowSelector = ({
  onFlowSelected,
  flowId,
  isDisabled,
}: {
  onFlowSelected?: (flowId: string) => void;
  flowId?: string;
  isDisabled?: boolean;
}) => {
  const { flows, loadFlows } = useFlowStore();

  useEffect(() => {
    loadFlows();
  }, []);

  return (
    <FormControl fullWidth size="small" variant="outlined">
      <InputLabel>Flows</InputLabel>
      <Select value={flowId || ""} label="Flows">
        {flows.map((flow, i) => (
          <MenuItem
            key={i}
            onClick={() => {
              if (isDisabled) return;
              onFlowSelected && onFlowSelected(flow.id);
            }}
            value={flow.id}
            disabled={isDisabled}
          >
            <SideBarItem
              LeftIcon={GiSharkFin}
              isSelected={flowId === flow.id}
              name={flow.name}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
