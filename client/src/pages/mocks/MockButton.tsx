import { Button } from "@mui/material";
import React from "react";
import { LoadingIcon } from "../sniffers/LoadingIcon";

interface SaveMockButtonProps {
  onClick: () => void;
  text: string;
  isLoading?: boolean;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
}
export const MockButton: React.FC<SaveMockButtonProps> = ({
  text,
  onClick,
  isLoading = false,
  color = "primary",
}) => {
  return (
    <Button variant="outlined" color={color} onClick={onClick}>
      {isLoading ? <LoadingIcon /> : text}
    </Button>
  );
};
