import { Tooltip } from "@mui/material";
import { selectIconByMethod } from "./SelectIconByMethod";

type EndpointProps = {
  timestamp?: string;
  method: string;
  url: string;
  isSelected?: boolean;
  onClick?: () => void;
};
export const Endpoint = ({
  method,
  url,
  isSelected,
  onClick,
}: EndpointProps) => {
  return (
    <Tooltip title={url} placement="top" arrow enterDelay={500}>
      <div
        className={`flex flex-row w-full hover:bg-primary p-2 cursor-pointer active:bg-tertiary items-center rounded-md space-x-4
    ${isSelected ? "bg-primary" : ""}`}
        onClick={onClick}
      >
        {selectIconByMethod(method)}
        <div className="flex text-sm max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
          {url}
        </div>
      </div>
    </Tooltip>
  );
};
