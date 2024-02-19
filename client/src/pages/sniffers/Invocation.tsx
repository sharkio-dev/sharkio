import { Tooltip } from "@mui/material";
import { selectIconByMethod } from "./selectIconByMethod";
import { useState } from "react";
import { CiLink } from "react-icons/ci";
export const selectIconByStatus = (status: number) => {
  if (status < 300) {
    return <span className="text-green-500 h-8 w-8 p-1">{status}</span>;
  } else if (status < 400) {
    return <span className="text-yellow-500 h-8 w-8 p-1">{status}</span>;
  }
  return <span className="text-red-500 h-8 w-8 p-1">{status}</span>;
};

type InvocationProps = {
  invocationLink?: string;
  status: number;
  url: string;
  method: string;
  date?: string;
  isSelected?: boolean;
  onClick?: () => void;
};
export const Invocation = ({
  status,
  url,
  method,
  isSelected,
  onClick,
  date,
  invocationLink
}: InvocationProps) => {
  const [copySuccess, setCopySuccess] = useState(false);


  // Function to handle the copy action
  const handleCopyClick = (event: any) => {
    event.stopPropagation();
    navigator.clipboard.writeText(`${invocationLink}`).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Resets the tooltip text after 2 seconds
    });
  };
  return (
    <div
      className={`flex flex-row px-2 hover:bg-secondary cursor-pointer active:bg-primary items-center hover:rounded-md justify-between border-b border-border-color ${isSelected ? "bg-primary" : ""}`}
      onClick={onClick} // Main onClick applied here for the whole div
    >
      <div className={`flex flex-row items-center space-x-1.5 ${isSelected ? "bg-primary" : ""}`}>
        {selectIconByMethod(method)}
        <div className="flex text-sm max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
          <div className="cursor-pointer flex flex-col items-center space-y-1">
            <Tooltip title={copySuccess ? "Link Copied!" : "Copy Link"} placement="top-end">
              <div><CiLink onClick={handleCopyClick} /></div>
            </Tooltip>
          </div>
        </div>
        <Tooltip title={url} placement="top-start">
          <div className="cursor-pointer" >
            {url}
          </div>
        </Tooltip>
      </div>
      <div className="flex flex-row items-center space-x-4">
        {selectIconByStatus(status)}
        <div className="flex text-xs text-gray-500">{date}</div>
      </div>
    </div>
  );
};
