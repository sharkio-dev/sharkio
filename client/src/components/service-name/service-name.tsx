import React from "react";
import { Chip } from "@mui/material";

interface IServiceNameProps {
  service: string;
}

export const ServiceName: React.FC<IServiceNameProps> = ({ service }) => {
  const color = "success";
  return <Chip color={color} label={service} />;
};
