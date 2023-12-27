import { TextField } from "@mui/material";
import React from "react";
import { SelectMethodDropDown } from "./SelectMethodDropDown";

interface MockUrlInputProps {
  url?: string;
  handleUrlChange: (value: string) => void;
  method?: string;
  handleMethodChange: (value: string) => void;
  snifferDomain?: string;
}
export const MockUrlInput: React.FC<MockUrlInputProps> = ({
  url,
  handleUrlChange,
  method,
  handleMethodChange,
  snifferDomain,
}) => {
  return (
    <>
      <div className="flex flex-row items-center w-40">
        <SelectMethodDropDown
          value={method || ""}
          onChange={(e: any) => {
            handleMethodChange(e.target.value);
          }}
        />
      </div>
      <div className="flex flex-row items-center w-[550px]">
        <TextField
          disabled={true}
          value={snifferDomain}
          variant="outlined"
          size="small"
          style={{ width: "100%" }}
        />
      </div>
      <TextField
        value={url || ""}
        onChange={(e) => {
          handleUrlChange(e.target.value);
        }}
        variant="outlined"
        size="small"
        style={{ width: "100%" }}
      />
    </>
  );
};
