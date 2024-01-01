import { Tooltip } from "@mui/material";
import { selectIconByMethod } from "./selectIconByMethod";

export const selectIconByStatus = (status: number) => {
  if (status < 300) {
    return <span className="text-green-500 h-8 w-8 p-1">{status}</span>;
  } else if (status < 400) {
    return <span className="text-yellow-500 h-8 w-8 p-1">{status}</span>;
  }
  return <span className="text-red-500 h-8 w-8 p-1">{status}</span>;
};

type InvocationProps = {
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
}: InvocationProps) => {
  return (
    <Tooltip title={url} placement="top" arrow enterDelay={500}>
      <div
        className={`flex flex-row w-full px-2 hover:bg-secondary cursor-pointer active:bg-primary items-center hover:rounded-md justify-between border-b border-border-color 
    ${isSelected ? "bg-primary" : ""}`}
        onClick={onClick}
      >
        <div className="flex flex-row items-center space-x-4">
          {selectIconByMethod(method)}
          <div className="flex text-sm max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
            {url}
          </div>
        </div>
        <div className="flex flex-row items-center space-x-4">
          {selectIconByStatus(status)}

          <div className="flex text-xs text-gray-500">{date}</div>
        </div>
      </div>
    </Tooltip>
  );
};
