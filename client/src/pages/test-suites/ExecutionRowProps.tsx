import { TableRow } from "@mui/material";
import * as React from "react";
import { FiChevronRight } from "react-icons/fi";
import { getRunStatusIcon } from "../flows/RunsTab";
import { ExecutionDetails } from "./ExecutionDetailsProps";

type ExecutionRowProps = {
  status: string;
  title: string;
  passed: number;
  failed: number;
  executionDate: string;
  checks: {
    type: "status_code" | "header" | "body";
    isPassed: boolean;
    expectedValue: string;
    actualValue: string;
    path: string;
    comparator: "eq" | "neq" | "contains" | "not_contains";
  }[];
};

export const ExecutionRow = ({
  status,
  title,
  passed,
  failed,
  checks,
  executionDate,
}: ExecutionRowProps) => {
  const [show, setShow] = React.useState<boolean>(false);

  const shouldShowData = status === "success" || status === "failed";

  return (
    <TableRow className="border-t-[1px] border-primary h-10 w-full">
      <div className="flex flex-col items-center w-full p-4 space-y-4">
        <div
          className="flex flex-row items-center justify-between hover:cursor-pointer active:bg-secondary transition-all duration-500 w-full"
          onClick={() => setShow(!show)}
        >
          <div className="flex flex-row items-center space-x-4">
            {getRunStatusIcon(status)}
            <div className="flex flex-col h-full">
              <span className="text-lg font-bold hover:cursor-pointer hover:scale-105">
                {title}
              </span>
              <span className="text-xs">{executionDate}</span>
            </div>
          </div>
          <div className="flex flex-row items-center space-x-4">
            {shouldShowData && (
              <>
                <div className="flex flex-col h-full">
                  <span className="text-xs">Passed: {passed}</span>
                  <span className="text-xs">Errors: {failed}</span>
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
          <div className="flex flex-col bg-primary rounded-lg w-full transition-all duration-500 border-[1px] border-border-color ">
            {checks.map((check, i) => (
              <ExecutionDetails
                targetPath={check.path}
                status={check.isPassed ? "success" : "failure"}
                type={
                  check.path.startsWith("header")
                    ? "header"
                    : check.path.startsWith("status")
                    ? "status_code"
                    : "body"
                }
                key={i}
                expectedValue={check.expectedValue}
                actualValue={check.actualValue}
              />
            ))}
          </div>
        )}
      </div>
    </TableRow>
  );
};
