import { useState } from "react";
import { Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { Flow, useFlowStore } from "../../stores/flowStore";
import { FlowNameAndSave } from "./FlowNameAndSaveProps";
import { RunsTab } from "./RunsTab";
import { TestsTab } from "./TestsTab";
import { LoadingIcon } from "../sniffers/LoadingIcon";

export const FlowContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tabNumber, setTabNumber] = useState("1");
  const { flows, isFlowsLoading } = useFlowStore();

  const handleTabChange = (_: any, newValue: string) => {
    setTabNumber(newValue);
  };

  const handleFlowNameChange = (name: string) => {
    // setFlow({ ...flow, name });
  };

  const handleSaveClicked = () => {
    setIsLoading(true);
    console.log("save clicked");
    setIsLoading(false);
  };

  return (
    <>
      {isFlowsLoading ? (
        <LoadingIcon />
      ) : (
        <>
          <FlowNameAndSave
            isLoading={isLoading}
            name={flows[0]?.name || ""}
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
