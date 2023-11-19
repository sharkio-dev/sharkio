import * as React from "react";

export const StatusCodeDetails = ({
  status = "success",
  expectedValue,
  actualValue,
}: {
  status: "success" | "failure";
  expectedValue: string;
  actualValue: string;
}) => {
  return (
    <div className="flex flex-row items-center w-full py rounded-lg pb-4 space-x-4 px-4">
      <div className="flex flex-row items-center w-1/2 h-full border-r-secondary border-r bg-secondary rounded-lg p-4">
        <span className="text text-xs">
          Expected Status Code - {expectedValue}
        </span>
      </div>
      <div className="flex flex-row items-center w-1/2 h-full border-r-secondary border-r bg-secondary rounded-lg p-4">
        <span className="text text-xs">
          {status === "success" ? (
            <span className="text-green-400 mr-2">✓</span>
          ) : (
            <span className="text-red-400 mr-2">✗</span>
          )}
          Actual Status Code - {actualValue}
        </span>
      </div>
    </div>
  );
};
