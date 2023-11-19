import * as React from "react";
import { BodyDetails } from "./BodyDetails";
import { HeaderDetails } from "./HeaderDetails";
import { StatusCodeDetails } from "./StatusCodeDetails";

type ExecutionDetailsProps = {
  status?: "success" | "failure";
  type?: "status_code" | "header" | "body";
  expectedValue: string;
  actualValue: string;
  targetPath: string;
};

export const ExecutionDetails = ({
  status = "success",
  type,
  expectedValue,
  actualValue,
  targetPath,
}: ExecutionDetailsProps) => {
  const [show, setShow] = React.useState<boolean>(false);
  return (
    <div className="flex flex-col items-center w-full space-y-4 border-b-[1px] border-border-color">
      <div className="flex flex-row items-center  h-10 w-full">
        <div className="flex flex-row items-center justify-between w-full px-4">
          <div className="flex flex-row items-center space-x-4">
            {status === "success" && (
              <span className="text text-green-400 text-xs font-bold">
                PASSED
              </span>
            )}
            {status === "failure" && (
              <span className="text text-red-400 text-xs font-bold">
                FAILED
              </span>
            )}
            <span className="text text-xs">
              {type === "status_code" && "Status Code"}
              {type === "header" && "Header"}
              {type === "body" && "Body"}
            </span>
          </div>
          <span
            className="text text-xs text-blue-400 font-bold hover:cursor-pointer hover:scale-105 active:scale-100"
            onClick={() => setShow(!show)}
          >
            {!show ? "Show Details" : "Hide Details"}
          </span>
        </div>
      </div>
      {type === "status_code" && show && (
        <StatusCodeDetails
          status={status}
          key={type}
          expectedValue={expectedValue}
          actualValue={actualValue}
        />
      )}
      {type === "header" && show && (
        <HeaderDetails
          status={status}
          key={type}
          expectedHeaderName={targetPath}
          expectedHeaderValue={expectedValue}
          actualHeaderName={targetPath}
          actualHeaderValue={actualValue}
        />
      )}
      {type === "body" && show && (
        <BodyDetails
          status={status}
          key={type}
          actualValue={actualValue}
          expectedValue={expectedValue}
        />
      )}
    </div>
  );
};
