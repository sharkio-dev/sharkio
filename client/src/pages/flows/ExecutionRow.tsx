import { Tab } from "@mui/material";
import * as React from "react";
import { FiChevronRight } from "react-icons/fi";
import { getRunStatusIcon } from "./RunsTab";
import {
  AssertionResult,
  NodeRunType,
  useFlowStore,
} from "../../stores/flowStore";
import { ExecutionDetails } from "./ExecutionDetailsProps";
import { RequestSection, ResponseSection } from "../sniffers/InvocationDetails";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { URLComponent } from "../live-Invocations/LiveInvocationUpperBar";
import { PiGraphLight } from "react-icons/pi";
import { useParams } from "react-router-dom";
import { LoadingIcon } from "../sniffers/LoadingIcon";

type ExecutionRowProps = {
  nodeRun: NodeRunType;
};

export const ExecutionRow = ({ nodeRun }: ExecutionRowProps) => {
  const [show, setShow] = React.useState<boolean>(false);
  const shouldShowData =
    nodeRun.status === "success" || nodeRun.status === "failed";
  const passed = nodeRun?.assertionsResult?.passed ?? [];
  const failed = nodeRun?.assertionsResult?.failed ?? [];

  return (
    <div className="flex flex-col items-center w-full p-4 space-y-4">
      <div
        className="flex flex-row items-center justify-between hover:cursor-pointer active:bg-secondary transition-all duration-500 w-full"
        onClick={() => setShow(!show)}
      >
        <div className="flex flex-row items-center space-x-4">
          {getRunStatusIcon(nodeRun.status)}
          <div className="flex flex-col h-full">
            <div className="flex flex-row items-center space-x-2">
              {nodeRun.type === "subflow" && (
                <PiGraphLight className="text-2xl" />
              )}
              <span className="text-lg font-bold hover:cursor-pointer hover:scale-105">
                {nodeRun.name}
              </span>
            </div>
            <span className="text-xs">
              {new Date(nodeRun.finishedAt).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex flex-row items-center space-x-4">
          {shouldShowData && (
            <>
              <div className="flex flex-col h-full">
                <span className="text-xs">Passed: {passed.length}</span>
                <span className="text-xs">Errors: {failed.length}</span>
              </div>
              {show ? (
                <FiChevronRight className="text-gray-400 text-2xl transform rotate-90" />
              ) : (
                <FiChevronRight className="text-gray-400 text-2xl" />
              )}
            </>
          )}
        </div>
      </div>
      {shouldShowData && show && nodeRun.type === "http" && (
        <HttpExtension nodeRun={nodeRun} />
      )}
      {shouldShowData && show && nodeRun.type === "subflow" && (
        <SubFlowExtension nodeRun={nodeRun} />
      )}
    </div>
  );
};

const SubFlowExtension = ({ nodeRun }: { nodeRun: NodeRunType }) => {
  const [subFlowNodeRun, setSubFlowNodeRun] = React.useState<NodeRunType[]>([]);
  const { loadNodeRuns } = useFlowStore();
  const [isRunLoading, setIsRunLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!nodeRun.subFlowId || !nodeRun.subFlowRunId) {
      return;
    }
    setIsRunLoading(true);
    loadNodeRuns(nodeRun.subFlowId, nodeRun.subFlowRunId)
      .then((runs) => {
        setSubFlowNodeRun(runs);
      })
      .finally(() => {
        setIsRunLoading(false);
      });
  }, [nodeRun]);
  console.log(isRunLoading);

  return (
    <div className="flex flex-col w-full border-[1px] border-border-color rounded-lg">
      {isRunLoading ? (
        <div className="flex h-full w-full justify-center items-center">
          <LoadingIcon />
        </div>
      ) : (
        subFlowNodeRun.map((run, i) => <ExecutionRow key={i} nodeRun={run} />)
      )}
      <div className="flex w-full bg-border-color h-[1px]" />
    </div>
  );
};

const HttpExtension = ({ nodeRun }: { nodeRun: NodeRunType }) => {
  const passed = nodeRun.assertionsResult.passed ?? [];
  const failed = nodeRun.assertionsResult.failed ?? [];
  const assertions = passed.concat(failed);
  const [tab, setTab] = React.useState("1");

  return (
    <TabContext value={tab}>
      <TabList
        onChange={(_, newValue) => {
          setTab(newValue);
        }}
        className="border-b-[0.1px] border-border-color w-full"
      >
        <Tab label="Assertions" value="1" />
        <Tab label={nodeRun.type === "http" ? "Request" : "Result"} value="2" />
        {nodeRun.type === "http" && <Tab label={"Response"} value="3" />}
      </TabList>
      <AssertionsTable assertions={assertions} />
      <ResponseTab response={nodeRun.response} />
      <RequestTab
        request={{
          headers: nodeRun.headers,
          body: nodeRun.body,
          method: nodeRun.method,
          url: nodeRun.url,
        }}
        proxyId={nodeRun.proxyId}
      />
    </TabContext>
  );
};

const AssertionsTable = ({ assertions }: { assertions: AssertionResult[] }) => {
  const assertionType = (path: string) => {
    if (path.startsWith("header")) {
      return "header";
    }
    if (path.startsWith("status")) {
      return "status_code";
    }
    if (path.startsWith("body")) {
      return "body";
    }
  };
  return (
    <TabPanel
      value="1"
      style={{ padding: 0, height: "100%", width: "100%", maxHeight: "450px" }}
    >
      <div className="flex flex-col bg-primary rounded-lg w-full transition-all duration-500 border-[1px] border-border-color ">
        {assertions.map((assertion, i) => (
          <ExecutionDetails
            targetPath={assertion.path}
            status={assertion.isPassed ? "success" : "failure"}
            type={assertionType(assertion.path)}
            key={i}
            expectedValue={assertion.expectedValue}
            actualValue={JSON.stringify(assertion.actualValue)}
          />
        ))}
      </div>
    </TabPanel>
  );
};

const ResponseTab = ({ response }: { response: NodeRunType["response"] }) => {
  return (
    <TabPanel
      value="3"
      style={{
        padding: 0,
        height: "100%",
        width: "100%",
        maxHeight: "450px",
        overflow: "auto",
      }}
    >
      <ResponseSection response={response} />
    </TabPanel>
  );
};

const RequestTab = ({
  request,
  proxyId,
}: {
  request: {
    headers: NodeRunType["headers"];
    body: NodeRunType["body"];
    method: NodeRunType["method"];
    url: NodeRunType["url"];
  };
  proxyId: string;
}) => {
  return (
    <TabPanel
      value="2"
      style={{
        padding: 0,
        paddingTop: 16,
        height: "100%",
        width: "100%",
        maxHeight: "600px",
        overflow: "auto",
      }}
    >
      <URLComponent
        url={request.url}
        method={request.method}
        snifferId={proxyId}
        isUrlDisabled={true}
        isMethodDisabled={true}
        isSnifferDisabled={true}
      />
      <RequestSection invocation={request} disabled={true} />
    </TabPanel>
  );
};
