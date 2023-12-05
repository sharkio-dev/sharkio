import { Button } from "@mui/material";
import React from "react";

interface OutlinedButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: "small" | "medium" | "large";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  startIcon?: React.ReactNode;
  value?: any;
}
const OutlinedButton = ({
  onClick,
  size = "small",
  startIcon,
  value,
  color = "primary",
}: OutlinedButtonProps) => {
  return (
    <Button
      variant="outlined"
      size={size}
      onClick={onClick}
      startIcon={startIcon}
      color={color}
    >
      {value}
    </Button>
  );
};

export default OutlinedButton;
