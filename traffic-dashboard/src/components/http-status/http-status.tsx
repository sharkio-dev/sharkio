import React from "react";
import { Chip } from "@mui/material";

interface IHttpMethodProps {
  status: 200 | 201 | 404 | 500 | number;
}

export const HttpStatus: React.FC<IHttpMethodProps> = ({ status }) => {
  const color = statusColor(status);
  return <Chip color={color} label={status} />;
};

function statusColor(status: number) {
  switch (status) {
    case 201:
    case 200: {
      return "success";
    }
    case 404: {
      return "warning";
    }
    case 500: {
      return "error";
    }
    default:
      return "default";
  }
}
