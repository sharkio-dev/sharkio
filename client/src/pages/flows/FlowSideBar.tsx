import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FlowType, useFlowStore } from "../../stores/flowStore";
import { useEffect, useState } from "react";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import GenericEditingModal from "../../components/project-selection/GenericEditingModal";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useNavigate, useParams } from "react-router-dom";
import { PiGraphLight } from "react-icons/pi";
import { SearchBar } from "../../components/search/SearchBar";
import { BsPlus } from "react-icons/bs";
import { Tooltip } from "@mui/material";

const NewFlowButton = () => {
  const { postFlow } = useFlowStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flowName, setFlowName] = useState("");
  const navigate = useNavigate();
  const { show: showSnackbar, component: snackBar } = useSnackbar();

  const handleFlowNameChange = (event: any) => {
    setFlowName(event.target.value);
  };

  const handleCreateFlow = () => {
    postFlow(flowName).then((res) => {
      navigate(`/flows/${res.id}`);
      showSnackbar("Flow created successfully", "success");
    });
  };
  return (
    <div>
      {snackBar}
      <Tooltip title="Create Flow">
        <div>
          <BsPlus
            className="text-2xl cursor-pointer hover:bg-border-color rounded-md active:bg-tertiary"
            onClick={() => {
              setIsModalOpen(true);
            }}
          />
        </div>
      </Tooltip>
      <GenericEditingModal
        modalProps={{
          open: isModalOpen,
          onClose: () => {
            setIsModalOpen(false);
          },
        }}
        paperHeadLine="New Flow"
        acceptButtonValue="Create"
        acceptButtonProps={{
          onClick: () => {
            setIsLoading(true);
            handleCreateFlow();
            setIsLoading(false);
            setIsModalOpen(false);
          },
        }}
        cancelButtonProps={{
          onClick: () => {
            setIsModalOpen(false);
          },
        }}
        textFieldProps={{
          label: "Flow Name",
          placeholder: "Enter flow name",
          onChange: handleFlowNameChange,
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

const FlowDeleteButton = ({ flowId }: { flowId: string }) => {
  const { deleteFlow } = useFlowStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flowName, setFlowName] = useState("");
  const { flows } = useFlowStore();
  const flow = flows.find((flow) => flow.id === flowId);
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const navigate = useNavigate();

  const handleFlowNameChange = (event: any) => {
    setFlowName(event.target.value);
  };

  const handleDeleteFlow = () => {
    if (flowName !== flow?.name) {
      showSnackbar(
        "Flow name does not match. Please enter the flow name to delete.",
        "error",
      );
      return;
    }
    deleteFlow(flowId).then(() => {
      navigate("/flows");
      showSnackbar("Flow deleted successfully", "success");
    });

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
          label: `Enter "${flow?.name}" to delete`,
          placeholder: `Enter "${flow?.name}" to delete`,
          onChange: (event: any) => {
            handleFlowNameChange(event);
          },
        }}
        isLoading={isLoading}
      />
      <AiOutlineDelete
        className="text-sm cursor-pointer hover:bg-border-color rounded-md"
        onClick={(e: any) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
      />
    </div>
  );
};

interface FlowSideBarProps {
  flows: FlowType[];
  selectedFlow?: FlowType;
  setSelectedFlow?: (flow: FlowType) => void;
}

const FlowsSideBar: React.FC<FlowSideBarProps> = ({ flows }) => {
  const navigate = useNavigate();
  const { flowId } = useParams();
  const [filteredFlows, setFilteredFlows] = React.useState<FlowType[]>([]);

  React.useEffect(() => {
    setFilteredFlows(flows);
  }, [flows]);

  const handleSearch = (searchTerm: string) => {
    const newFlows = flows.filter((flow) =>
      flow.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredFlows(newFlows);
  };
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row items-center space-x-2">
        <SearchBar handleSearch={handleSearch} />
        <NewFlowButton />
      </div>
      <div className="flex flex-col overflow-y-scroll min-h-96 h-2/3 w-full">
        {filteredFlows.map((flow) => (
          <div
            className={`flex p-1 flex-row w-full items-center rounded-md space-x-4 hover:bg-primary cursor-pointer active:bg-tertiary
          ${flow.id === flowId ? "bg-primary" : ""}`}
            onClick={() => {
              navigate(`/flows/${flow.id}`);
            }}
          >
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <PiGraphLight className="text-2xl" />
                <div className="flex w-full text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
                  {flow.name}
                </div>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <FlowDeleteButton flowId={flow.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FlowSideBar: React.FC = () => {
  const { flows, loadFlows, isFlowsLoading } = useFlowStore();
  const { show: showSnackbar, component: snackBar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadFlows(true, "flow");
      } catch (error) {
        showSnackbar("Could not load flows.", "error");
        return;
      }
    };

    fetchData();
  }, [loadFlows]);

  return (
    <>
      {snackBar}
      <div className="flex flex-col space-y-4 px-2">
        <div className="flex flex-col">
          {isFlowsLoading ? <LoadingIcon /> : <FlowsSideBar flows={flows} />}
        </div>
      </div>
    </>
  );
};
