import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { TextButton } from "../../components/TextButton";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { URLComponent } from "../live-Invocations/LiveInvocationUpperBar";
import { SelectComponent } from "../../components/select-component/SelectComponent";
import { InvocationType } from "../sniffers/types";
import { RequestSection } from "../sniffers/InvocationDetails";
import { NodeType, useFlowStore } from "../../stores/flowStore";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { Button } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
import { FaArrowLeftLong } from "react-icons/fa6";

export const FlowStepPage = () => {
  const { loadNode, putNode } = useFlowStore();
  const [flowStep, setFlowStep] = useState<NodeType>();
  const { flowId, testId } = useParams();
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (!flowId || !testId) return;
    loadNode(flowId, testId, true).then((node: NodeType) => {
      setFlowStep(node);
    });
  }, [flowId, testId]);

  const handleAssertionChange = (assertion: any, index: number) => {
    setFlowStep((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        assertions: prev.assertions?.map((a, i) =>
          i === index ? assertion : a,
        ),
      };
    });
  };

  const handleAddAssertion = (newAssertion: AssertionType) => {
    return setFlowStep((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        assertions: [...(prev.assertions ?? []), newAssertion],
      };
    });
  };

  if (!flowStep) return <LoadingIcon />;

  return (
    <PanelGroup
      direction={"vertical"}
      className="max-w-[calc(100vw-56px)] min-h-[calc(100vh-184px)] max-h-[calc(100vh)] overflow-y-auto"
    >
      <Panel defaultSize={70} maxSize={80}>
        <div className="flex flex-col p-4 w-full pb-0">
          {snackBar}

          <div className="flex flex-row items-center space-x-4">
            <GoBackButton onClick={() => navigate(-1)} />
            <URLComponent
              method={flowStep.method}
              url={flowStep.url}
              snifferId={flowStep.proxyId}
              onMethodChange={(value) => {
                setFlowStep((prev) => {
                  if (!prev) return prev;
                  return { ...prev, method: value };
                });
              }}
              onUrlChange={(value) => {
                setFlowStep((prev) => {
                  if (!prev) return prev;
                  return { ...prev, url: value };
                });
              }}
              onSnifferChange={(value) => {
                setFlowStep((prev) => {
                  if (!prev) return prev;
                  return { ...prev, proxyId: value };
                });
              }}
            />
            <Button
              variant="outlined"
              color="success"
              onClick={() => {
                if (!flowId) return;
                putNode(flowId, { ...flowStep, snifferId: undefined }).then(
                  () => {
                    showSnackbar("Saved", "success");
                  },
                );
              }}
            >
              Save
            </Button>
          </div>
          <RequestSection
            // @ts-ignore
            invocation={{ ...flowStep, snifferId: flowStep.proxyId }}
            setInvocation={(invocation: InvocationType) => {
              setFlowStep((prev) => {
                if (!prev) return prev;
                return { ...prev, ...invocation };
              });
            }}
          />
        </div>
      </Panel>
      <div className="relative h-[1px] w-full my-4 hover:bg-blue-300 bg-border-color">
        <PanelResizeHandle
          className={`absolute h-[30px] w-full top-[-15px] `}
        />
      </div>
      <Panel maxSize={70}>
        <div className=" flex-col px-2 w-full h-full space-y-2 overflow-y-auto">
          <div className="flex flex-row items-center space-x-2">
            <TextButton
              text="Header Assertion"
              onClick={() => {
                handleAddAssertion({
                  path: "headers.example",
                  comparator: "eq",
                  expectedValue: "",
                });
              }}
            />
            <TextButton
              text="Body Assertion"
              onClick={() => {
                handleAddAssertion({
                  path: "body.example",
                  comparator: "eq",
                  expectedValue: "",
                });
              }}
            />
            <TextButton
              text="Status Assertion"
              onClick={() => {
                handleAddAssertion({
                  path: "status",
                  comparator: "eq",
                  expectedValue: "",
                });
              }}
            />
          </div>
          {flowStep.assertions?.map((assertion, index) => (
            <Assertion
              assertion={assertion}
              handleAssertionChange={(newAssertion) => {
                handleAssertionChange(newAssertion, index);
              }}
              hadndlDeleteAssertion={() => {
                setFlowStep((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    assertions: prev.assertions?.filter((_, i) => i !== index),
                  };
                });
              }}
            />
          ))}
        </div>
      </Panel>
    </PanelGroup>
  );
};

interface AssertionType {
  path: string;
  comparator: string;
  expectedValue: string;
}

interface AssertionProps {
  assertion: AssertionType;
  handleAssertionChange: (assertion: AssertionType) => void;
  hadndlDeleteAssertion: () => void;
}

const Assertion: React.FC<AssertionProps> = ({
  assertion,
  handleAssertionChange,
  hadndlDeleteAssertion,
}) => {
  return (
    <div className="flex flex-row items-center space-x-2 w-full">
      <div className="flex flex-row items-center space-x-2 w-full">
        <input
          className="border border-border-color rounded-md px-2 py-1 w-full"
          placeholder="Path"
          value={assertion.path}
          onChange={(event) => {
            handleAssertionChange({ ...assertion, path: event.target.value });
          }}
        />
        <div className="flex flex-row min-w-28 h-full">
          <SelectComponent
            options={[
              { label: "eq", value: "eq" },
              { label: "neq", value: "neq" },
            ]}
            value={assertion.comparator}
            setValue={(value: string) => {
              handleAssertionChange({ ...assertion, comparator: value });
            }}
            variant="outlined"
          />
        </div>

        <input
          className="border border-border-color rounded-md px-2 py-1 w-full"
          placeholder="Value"
          value={assertion.expectedValue}
          onChange={(event) => {
            handleAssertionChange({
              ...assertion,
              expectedValue: event.target.value,
            });
          }}
        />
        <div className="flex flex-row min-w-[20px] h-full">
          <AiOutlineDelete
            className="flex text-[#fff] text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
            onClick={() => {
              hadndlDeleteAssertion();
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface GoBackButtonProps {
  onClick: () => void;
}

export const GoBackButton: React.FC<GoBackButtonProps> = ({ onClick }) => {
  return (
    <FaArrowLeftLong
      className="text-xl bg-border-color rounded-full p-1 cursor-pointer active:scale-95 transition-all hover:text-magic"
      onClick={onClick}
    />
  );
};
