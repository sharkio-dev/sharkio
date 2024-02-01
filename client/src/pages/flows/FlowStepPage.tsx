import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { TextButton } from "../../components/TextButton";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { InvocationURL } from "../live-Invocations/LiveInvocationUpperBar";
import { SelectComponent } from "../../components/select-component/SelectComponent";
import { InvocationType } from "../sniffers/types";
import { RequestSection } from "../sniffers/InvocationDetails";
import { useFlowStore } from "../../stores/flowStore";
import { FlowStep } from "./flowPage";
import { useParams } from "react-router-dom";

export const FlowStepPage = () => {
  const { loadNode } = useFlowStore();
  const [flowStep, setFlowStep] = useState<FlowStep>();
  const { flowId, testId } = useParams();

  useEffect(() => {
    if (!flowId || !testId) return;
    loadNode(flowId, testId).then((node) => {
      setFlowStep(node);
    });
  }, [flowId, testId]);

  const handleAssertionChange = (assertion: any, index: number) => {
    // setFlowStep((prev) => ({
    //   ...prev,
    //   assertions: prev.assertions?.map((a, i) => (i === index ? assertion : a)),
    // }));
  };

  const handleAddAssertion = (newAssertion: AssertionType) => {
    // return setFlowStep((prev) => {
    //   return {
    //     ...prev,
    //     assertions: [...(prev.assertions ?? []), newAssertion],
    //   };
    // });
  };

  if (!flowStep) return null;

  return (
    <PanelGroup
      direction={"vertical"}
      className="max-w-[calc(100vw-56px)] min-h-[calc(100vh-184px)] max-h-[calc(100vh-184px)]"
    >
      <Panel defaultSize={60} maxSize={80}>
        <div className="flex flex-col p-4 w-full pb-0">
          <InvocationURL
            // @ts-ignore
            invocation={flowStep as InvocationType}
            setEditedInvocation={
              (invocation) => {}
              // setFlowStep((prev) => ({ ...prev, ...invocation }))
            }
            showUrlButtons={false}
          />
          <RequestSection
            // @ts-ignore
            invocation={flowStep as InvocationType}
            setInvocation={
              (invocation: InvocationType) => {}
              // setFlowStep((prev) => ({ ...prev, ...invocation }))
            }
          />
        </div>
      </Panel>
      <div className="relative h-[1px] w-full my-4 hover:bg-blue-300 bg-border-color">
        <PanelResizeHandle
          className={`absolute h-[30px] w-full top-[-15px] `}
        />
      </div>
      <Panel maxSize={70}>
        <div className="flex flex-col px-2 w-full h-full space-y-2">
          <div className="flex flex-row items-center space-x-2">
            <TextButton
              text="Header Assertion"
              onClick={() => {
                handleAddAssertion({
                  path: "headers.example",
                  comparator: "eq",
                  expectedValue: "example",
                });
              }}
            />
            <TextButton
              text="Body Assertion"
              onClick={() => {
                handleAddAssertion({
                  path: "body.example",
                  comparator: "eq",
                  expectedValue: "example",
                });
              }}
            />
            <TextButton
              text="Status Assertion"
              onClick={() => {
                handleAddAssertion({
                  path: "status",
                  comparator: "eq",
                  expectedValue: "200",
                });
              }}
            />
          </div>
          {flowStep.assertions?.map((assertion, index) => (
            <Assertion
              assertion={assertion}
              handleAssertionChange={() => {
                handleAssertionChange(assertion, index);
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
}

const Assertion: React.FC<AssertionProps> = ({
  assertion,
  handleAssertionChange,
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
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );
};
