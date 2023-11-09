import { CircularProgress, Tooltip } from "@mui/material";

export type ConfigButtonProps = {
  tooltip?: string;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
};

export const ConfigButton = ({
  className,
  tooltip = "",
  onClick,
  disabled = false,
  isLoading = false,
  children,
}: ConfigButtonProps) => {
  return (
    <Tooltip title={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-1 cursor-pointer flex items-center justify-center ${className}`}
      >
        {isLoading ? <CircularProgress size={20} /> : children}
      </button>
    </Tooltip>
  );
};
