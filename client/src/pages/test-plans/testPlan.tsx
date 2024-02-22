import TabContext from "@mui/lab/TabContext";
import InnerPageTemplate from "../../components/inner-page-template/inner-page-template";
import { FlowNameAndRun } from "../flows/FlowNameAndSaveProps";
import { TestPlansSideBar } from "./TestPlansSideBar";
import TabList from "@mui/lab/TabList";
import { Tab } from "@mui/material";
import { RunsTab } from "../flows/RunsTab";
import { useParams, useSearchParams } from "react-router-dom";
import { useFlowStore } from "../../stores/flowStore";
import { useEffect, useState } from "react";

const TestPlans = () => {
  return (
    <InnerPageTemplate
      sideBarComponent={TestPlansSideBar}
      contentComponent={TestPlansContent}
    />
  );
};

const TestPlansContent = () => {
  const { flows, putFlow, loadFlowRuns } = useFlowStore();
  const { testPlanId } = useParams();
  const flow = flows.find((f) => f.id === testPlanId);
  const [flowName, setFlowName] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (flow) {
      setFlowName(flow.name);
    }
  }, [flow]);

  const handleTabChange = (_: any, newValue: string) => {
    setSearchParams((prevSearchParams) => {
      const newSearchParams = new URLSearchParams(prevSearchParams);
      newSearchParams.set("tab", newValue);
      return newSearchParams;
    });
  };

  const handleFlowNameChange = (name: string) => {
    if (!flow) return;
    setFlowName(name);
  };

  const handleSaveClicked = () => {
    if (!flow) return;
    putFlow({ ...flow, name: flowName }, false, "suite");
  };

  if (!testPlanId) {
    return null;
  }

  return (
    <>
      <FlowNameAndRun
        flowId={testPlanId as string}
        isLoading={false}
        name={flowName}
        handleNameChange={handleFlowNameChange}
        handleSaveClicked={handleSaveClicked}
        afterRun={() => {
          loadFlowRuns(testPlanId as string, true);
        }}
      />
      <TabContext value={searchParams.get("tab") || "1"}>
        <TabList
          onChange={handleTabChange}
          className="border-b-[0.1px] border-border-color"
        >
          <Tab label="Runs" value="1" />
          <Tab label="Schedule" value="2" />
        </TabList>
        <RunsTab flowId={testPlanId} tab="1" />
      </TabContext>
    </>
  );
};

export default TestPlans;
