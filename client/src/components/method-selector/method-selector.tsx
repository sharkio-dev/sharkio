import { Autocomplete, Chip, TextField } from "@mui/material";
import React from "react";

interface IMethodSelectProps {
  onChange: (value: string[]) => void;
}

export const MethodSelector: React.FC<IMethodSelectProps> = ({ onChange }) => {
  const methods = ["GET", "POST", "PATCH", "PUT", "DELETE"];
  return (
    <Autocomplete
      freeSolo
      disablePortal
      multiple
      renderTags={(value: string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip
            variant="outlined"
            label={option}
            {...getTagProps({ index })}
            key={option}
          />
        ))
      }
      options={methods}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField variant="filled" {...params} label="Method" />
      )}
      onChange={(_, value) => {
        onChange?.(value);
      }}
    />
  );
};
