import { TableRow } from "@mui/material";
import * as React from "react";
import { FiChevronRight } from "react-icons/fi";
import { getRunStatusIcon } from "./RunsTab";
import { NodeRunType } from "../../stores/flowStore";
import { ExecutionDetails } from "../test-suites/ExecutionDetailsProps";
import { ResponseSection } from "../sniffers/InvocationDetails";

type ExecutionRowProps = {
  nodeRun: NodeRunType;
};

export const ExecutionRow = ({ nodeRun }: ExecutionRowProps) => {
  const [show, setShow] = React.useState<boolean>(false);

  const shouldShowData =
    nodeRun.status === "success" || nodeRun.status === "failed";
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
                {new Date(nodeRun.createdAt).toLocaleString()}
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
        {
          // Show the data if the execution is successful or failed
          shouldShowData && show && (
            <ResponseSection response={nodeRun.response} />
          )
        }
        {shouldShowData && show && (
          <div className="flex flex-col bg-primary rounded-lg w-full transition-all duration-500 border-[1px] border-border-color ">
            {assertions.map((assertion, i) => (
              <ExecutionDetails
                targetPath={assertion.path}
                status={assertion.isPassed ? "success" : "failure"}
                type={assertionType(assertion.path)}
                key={i}
                expectedValue={assertion.expectedValue}
                actualValue={assertion.actualValue}
              />
            ))}
          </div>
        )}
      </div>
    </TableRow>
  );
};
