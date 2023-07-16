import { Chip } from "@mui/material";
import { SnifferConfig } from "../../types/types";

interface IServiceNameProps {
  service: SnifferConfig;
}

export const ServiceName: React.FC<IServiceNameProps> = ({ service }) => {
  const color = "success";
  return <Chip color={color} label={service.name} />;
};
