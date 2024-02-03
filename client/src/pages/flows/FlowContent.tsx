import { useEffect, useState } from "react";
import { Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { FlowType, useFlowStore } from "../../stores/flowStore";
import { FlowNameAndRun } from "./FlowNameAndSaveProps";
import { RunsTab } from "./RunsTab";
import { TestsTab } from "./TestsTab";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { useParams } from "react-router-dom";

export const FlowContent: React.FC = () => {
  const [tabNumber, setTabNumber] = useState("1");
  const { flows, isFlowsLoading, putFlow } = useFlowStore();
  const { flowId } = useParams();
  const flow = flows.find((f) => f.id === flowId);
  const [flowName, setFlowName] = useState("");

  useEffect(() => {
    if (flow) {
      setFlowName(flow.name);
    }
  }, [flow]);

  const handleTabChange = (_: any, newValue: string) => {
    setTabNumber(newValue);
  };

  const handleFlowNameChange = (name: string) => {
    if (!flow) return;
    setFlowName(name);
  };

  const handleSaveClicked = () => {
    if (!flow) return;
    putFlow({ ...flow, name: flowName });
  };
  if (!flowId) {
    return null;
  }

  return (
    <>
      {isFlowsLoading ? (
        <LoadingIcon />
      ) : (
        <>
          <FlowNameAndRun
            isLoading={false}
            name={flowName}
            handleNameChange={handleFlowNameChange}
            handleSaveClicked={handleSaveClicked}
          />
          <TabContext value={tabNumber}>
            <TabList
              onChange={handleTabChange}
              className="border-b-[0.1px] border-border-color"
            >
              <Tab label="Tests" value="1" />
              <Tab label="Runs" value="2" />
            </TabList>
            <TestsTab />
            <RunsTab />
          </TabContext>
        </>
      )}
    </>
  );
};
