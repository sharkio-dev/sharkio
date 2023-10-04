import React from "react";
import { Chip } from "@mui/material";

interface IHttpMethodProps {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | string;
}

export const HttpMethod: React.FC<IHttpMethodProps> = ({ method }) => {
  const color = methodColor(method);
  return <Chip color={color} label={method} />;
};

function methodColor(method: string) {
  switch (method) {
    case "GET": {
      return "success";
    }
    case "PATCH": {
      return "info";
    }
    case "POST": {
      return "warning";
    }
    case "DELETE": {
      return "error";
    }
    default:
      return "default";
  }
}
