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
  /* maps statuses numbers to color string e.g. 201 -> success */
  const statusesMap = {
    2: "success",
    4: "warning",
    5: "error",
  } as any;
  return statusesMap[status.toString().slice(0, 1)] || "default";
}
