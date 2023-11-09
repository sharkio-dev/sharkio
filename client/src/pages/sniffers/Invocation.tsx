import { Tooltip } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";

type InvocationProps = {
  status: number;
  url: string;
  date?: string;
  isSelected?: boolean;
  onClick?: () => void;
};
export const Invocation = ({
  status,
  url,
  isSelected,
  onClick,
  date,
}: InvocationProps) => {
  const selectIconByStatus = (status: number) => {
    if (status < 300) {
      return <span className="text-green-500 h-8 w-8 p-1">{status}</span>;
    } else if (status < 400) {
      return <span className="text-yellow-500 h-8 w-8 p-1">{status}</span>;
    }
    return <span className="text-red-500 h-8 w-8 p-1">{status}</span>;
  };

  return (
    <Tooltip title={url} placement="top" arrow enterDelay={500}>
      <div
        className={`flex flex-row w-full px-2 hover:bg-secondary cursor-pointer active:bg-primary items-center hover:rounded-md justify-between border-b border-border-color 
    ${isSelected ? "bg-primary" : ""}`}
        onClick={onClick}
      >
        <div className="flex flex-row items-center space-x-4">
          {selectIconByStatus(status)}
          <div className="flex text-xs text-gray-500">{date}</div>
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
