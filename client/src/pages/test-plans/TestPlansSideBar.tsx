import { useEffect, useState } from "react";
import { FlowType, getFlows, useFlowStore } from "../../stores/flowStore";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { SideBarItem } from "../sniffers/SniffersSideBar";
import { useNavigate, useParams } from "react-router-dom";
import GenericEditingModal from "../../components/project-selection/GenericEditingModal";
import { CiImport } from "react-icons/ci";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { BsPlus } from "react-icons/bs";
import { useSnackbar } from "../../hooks/useSnackbar";
import { PiGraphLight } from "react-icons/pi";
import { LuClipboardCheck } from "react-icons/lu";

export const TestPlansSideBar = () => {
  const { loadFlows, loadNodes, nodes, deleteNode } = useFlowStore();
  const { testPlanId } = useParams();

  useEffect(() => {
    loadFlows(true, "suite");
  }, []);

  useEffect(() => {
    if (!testPlanId) return;
    loadNodes(testPlanId, true);
  }, [testPlanId]);

  return (
    <div className="flex flex-col space-y-2 px-2 h-full py-2 overflow-y-auto w-full">
      <TestPlanDropDown />
      <div className="border-b border-border-color pb-2 mb-2">
        <ImportTestPlanButton />
      </div>
      <div className="flex flex-col space-y-1 w-full">
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`flex p-1 w-full flex-row items-center rounded-md space-x-4 hover:bg-primary cursor-pointer active:bg-tertiary`}
          >
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-row items-center space-x-2">
                <PiGraphLight className="text-2xl" />
                <div className="flex w-full text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
                  {node.name}
                </div>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <Tooltip title="Remove flow from Test Plan" placement="top">
                  <div>
                    <IoIosRemoveCircleOutline
                      className="text-sm cursor-pointer hover:bg-border-color rounded-md"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        if (!testPlanId) return;
                        deleteNode(testPlanId, node.id);
                      }}
                    />
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const ImportTestPlanButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flows, setFlows] = useState<FlowType[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<FlowType>();
  const { testPlanId } = useParams();
  const { postNode } = useFlowStore();

  useEffect(() => {
    if (!isModalOpen) return;
    getFlows("flow").then((res) => {
      setFlows(res.data);
    });
  }, [isModalOpen]);

  return (
    <div>
      <div
        className={`flex flex-row w-full hover:bg-primary p-1 cursor-pointer active:bg-tertiary items-center rounded-md`}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <div
          className={`flex text-sm max-w-full overflow-ellipsis whitespace-nowrap items-center`}
        >
          <CiImport className="text-blue-500 h-8 w-8 p-1 mr-4" />
          Import Flow
        </div>
      </div>
      <GenericEditingModal
        modalProps={{
          open: isModalOpen,
          onClose: () => {
            setIsModalOpen(false);
          },
        }}
        paperHeadLine="Import Flow"
        acceptButtonValue="Import"
        acceptButtonProps={{
          onClick: () => {
            if (!selectedFlow) return;
            if (!testPlanId) return;
            postNode(testPlanId, {
              url: "/",
              method: "GET",
              headers: {},
              body: "",
              assertions: [],
              name: selectedFlow?.name,
              subFlowId: selectedFlow?.id,
              type: "subflow",
            }).then(() => {
              setIsModalOpen(false);
            });
          },
        }}
        cancelButtonProps={{
          onClick: () => {
            setIsModalOpen(false);
          },
        }}
        isLoading={false}
      >
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel>Flows</InputLabel>
          <Select value={selectedFlow?.id} label="Flows">
            {flows.map((flow, i) => (
              <MenuItem
                key={i}
                value={flow.id}
                onClick={() => {
                  setSelectedFlow(flow);
                }}
              >
                <SideBarItem name={flow.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </GenericEditingModal>
    </div>
  );
};
const TestPlanDropDown = () => {
  const { testPlans, deleteFlow } = useFlowStore();
  const navigator = useNavigate();
  const { testPlanId } = useParams();

  return (
    <div className="flex flex-row items-center space-x-2">
      <FormControl fullWidth size="small" variant="outlined">
        <InputLabel>Test Plans</InputLabel>
        <Select value={testPlanId || ""} label="Test Plans">
          {testPlans.map((testPlan, i) => (
            <MenuItem
              key={i}
              value={testPlan.id}
              onClick={() => {
                navigator(`/test-plans/${testPlan.id}`);
              }}
            >
              <SideBarItem
                name={testPlan.name}
                onDelete={() => {
                  deleteFlow(testPlan.id, false, "suite").then(() => {
                    navigator(`/test-plans`);
                  });
                }}
                isSelected={testPlanId === testPlan.id}
                LeftIcon={LuClipboardCheck}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="flex flex-row items-center space-x-2">
        <NewTestPlanButton />
      </div>
    </div>
  );
};

export const NewTestPlanButton = () => {
  const { postFlow } = useFlowStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testPlanName, setTestPlanName] = useState("");
  const navigate = useNavigate();
  const { show: showSnackbar, component: snackBar } = useSnackbar();

  const handleTestPlanNameChange = (event: any) => {
    setTestPlanName(event.target.value);
  };

  const handleCreateTestPlan = () => {
    postFlow(testPlanName, false, "suite").then((res) => {
      navigate(`/test-plans/${res.id}`);
      showSnackbar("Test plan created successfully", "success");
    });
  };
  return (
    <div>
      {snackBar}
      <BsPlus
        className="text-2xl cursor-pointer hover:bg-border-color rounded-md active:bg-tertiary"
        onClick={() => {
          setIsModalOpen(true);
        }}
      />
      <GenericEditingModal
        modalProps={{
          open: isModalOpen,
          onClose: () => {
            setIsModalOpen(false);
          },
        }}
        paperHeadLine="New Test Plan"
        acceptButtonValue="Create"
        acceptButtonProps={{
          onClick: () => {
            setIsLoading(true);
            handleCreateTestPlan();
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
          label: "Test Plan Name",
          placeholder: "Enter Test Plan Name",
          onChange: handleTestPlanNameChange,
        }}
        isLoading={isLoading}
      />
    </div>
  );
};
