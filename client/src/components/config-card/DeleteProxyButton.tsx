import { Delete } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export const DeleteProxyButton = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <Tooltip title="Remove the sniffer">
      <button
        onClick={onClick}
        disabled={disabled}
        className="px-1 cursor-pointer"
      >
        <Delete color={disabled ? "disabled" : "error"}></Delete>
      </button>
    </Tooltip>
  );
};
