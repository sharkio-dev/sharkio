import { Button } from "@mui/material";
import React from "react";

interface OutlinedButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: "small" | "medium" | "large";
  startIcon?: React.ReactNode;
  value?: any;
}
const OutlinedButton = ({
  onClick,
  size = "small",
  startIcon,
  value,
}: OutlinedButtonProps) => {
  return (
    <Button
      variant="outlined"
      size={size}
      onClick={onClick}
      startIcon={startIcon}
    >
      {value}
    </Button>
  );
};

export default OutlinedButton;
