import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export const BodyHeaderStatusToggle = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) => {
  return (
    <ToggleButtonGroup
      color="primary"
      exclusive
      onChange={(_, value) => setValue(value)}
      className="flex flex-row w-full items-center justify-center mb-8"
      value={value}
    >
      <ToggleButton value="Status" className="w-24 h-6">
        Status
      </ToggleButton>
      <ToggleButton value="Body" className="w-24 h-6">
        Body
      </ToggleButton>
      <ToggleButton value="Headers" className="w-24 h-6">
        {" "}
        Headers
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
