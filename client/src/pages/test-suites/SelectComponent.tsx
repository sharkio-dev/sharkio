import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

type SelectComponentProps = {
  options: { value: string; label: string }[];
  title: string;
};

export function SelectComponent({ options, title }: SelectComponentProps) {
  const [testSuite, setTestSuite] = React.useState(
    options.length > 0 ? options[0].value : ""
  );

  const handleChange = (event: any) => {
    setTestSuite(event.target.value as string);
  };

  return (
    <FormControl sx={{ width: "100%" }} size="small">
      <InputLabel>{title}</InputLabel>
      <Select value={testSuite} label={title} onChange={handleChange}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
