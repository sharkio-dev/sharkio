import { ToggleButton, ToggleButtonGroup } from "@mui/material";

export const BodyHeaderToggle = ({
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
      <ToggleButton value="Body" className="w-32 h-6" sx={{ fontSize: 12 }}>
        Body & Status
      </ToggleButton>
      <ToggleButton value="Headers" className="w-32 h-6" sx={{ fontSize: 12 }}>
        {" "}
        Headers
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
