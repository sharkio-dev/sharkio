import { Tooltip } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import * as React from "react";

type InvocationProps = {
  status: number;
  url: string;
  isSelected?: boolean;
  onClick?: () => void;
};
export const Invocation = ({
  status,
  url,
  isSelected,
  onClick,
}: InvocationProps) => {
  const selectIconByStatus = (status: number) => {
    if (status < 300) {
      return <span className="text-green-500 h-8 w-8 p-1 mr-4">{status}</span>;
    } else if (status < 400) {
      return <span className="text-yellow-500 h-8 w-8 p-1 mr-4">{status}</span>;
    }
    return <span className="text-red-500 h-8 w-8 p-1 mr-4">{status}</span>;
  };

  return (
    <Tooltip title={url} placement="top" arrow enterDelay={500}>
      <div
        className={`flex flex-row w-full hover:bg-secondary cursor-pointer active:bg-primary items-center hover:rounded-md justify-between border-b border-border-color 
    ${isSelected ? "bg-primary" : ""}`}
        onClick={onClick}
      >
        <div className="flex flex-row items-center">
          {selectIconByStatus(status)}
          <div className="flex text-sm max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
            {url}
          </div>
        </div>
        <div className="flex flex-row items-center">
          <PlayArrow className="text-green-500 p-1" />
        </div>
      </div>
    </Tooltip>
  );
};
