import { ToggleButton, ToggleButtonGroup } from "@mui/material";

interface TestButtonSectionProps {
  changePart: (value: string) => void;
  partName: string;
  tabNumber?: string;
}
const TestButtonSection = ({
  changePart,
  partName,
  tabNumber,
}: TestButtonSectionProps) => {
  return (
    <ToggleButtonGroup
      color="primary"
      exclusive
      onChange={(_, value) => changePart(value)}
      className="flex flex-row w-full items-center justify-center mb-8"
      value={partName}
    >
      {tabNumber === "1" && (
        <ToggleButton value="Status" className="w-24 h-6">
          Status
        </ToggleButton>
      )}
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

export default TestButtonSection;
