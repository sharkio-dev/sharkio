import { Tab, TableRow } from "@mui/material";
import * as React from "react";
import { FiChevronRight } from "react-icons/fi";
import { getRunStatusIcon } from "./RunsTab";
import { AssertionResult, NodeRunType } from "../../stores/flowStore";
import { ExecutionDetails } from "../test-suites/ExecutionDetailsProps";
import { RequestSection, ResponseSection } from "../sniffers/InvocationDetails";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { URLComponent } from "../live-Invocations/LiveInvocationUpperBar";

type ExecutionRowProps = {
  nodeRun: NodeRunType;
};

export const ExecutionRow = ({ nodeRun }: ExecutionRowProps) => {
  const [show, setShow] = React.useState<boolean>(false);
  const [tab, setTab] = React.useState("1");

  const shouldShowData =
    nodeRun.status === "success" || nodeRun.status === "failed";

  const passed = nodeRun.assertionsResult.passed ?? [];
  const failed = nodeRun.assertionsResult.failed ?? [];
  const assertions = passed.concat(failed);

  return (
    <TableRow className="border-t-[1px] border-primary h-10 w-full">
      <div className="flex flex-col items-center w-full p-4 space-y-4">
        <div
          className="flex flex-row items-center justify-between hover:cursor-pointer active:bg-secondary transition-all duration-500 w-full"
          onClick={() => setShow(!show)}
        >
          <div className="flex flex-row items-center space-x-4">
            {getRunStatusIcon(nodeRun.status)}
            <div className="flex flex-col h-full">
              <span className="text-lg font-bold hover:cursor-pointer hover:scale-105">
                {nodeRun.name}
              </span>
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

        {shouldShowData && show && (
          <TabContext value={tab}>
            <TabList
              onChange={(_, newValue) => setTab(newValue)}
              className="border-b-[0.1px] border-border-color w-full"
            >
              <Tab label="Assertions" value="1" />
              <Tab label="Request" value="2" />
              <Tab label="Response" value="3" />
            </TabList>
            <ResponseTab response={nodeRun.response} />
            <AssertionsTable assertions={assertions} />
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
        )}
      </div>
    </TableRow>
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
