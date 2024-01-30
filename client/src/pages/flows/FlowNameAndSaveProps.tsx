import { Button } from "@mui/material";
import { EditableNameField } from "./EditableNameProps";

interface FlowNameAndSaveProps {
  isLoading: boolean;
  name: string;
  handleSaveClicked: () => void;
  handleNameChange: (namg: string) => void;
}

export const FlowNameAndSave: React.FC<FlowNameAndSaveProps> = ({
  isLoading,
  name,
  handleNameChange,
  handleSaveClicked,
}) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <EditableNameField
        isLoading={isLoading}
        name={name}
        handleNameChange={handleNameChange}
        handleSaveClicked={handleSaveClicked}
      />
      <Button
        variant="outlined"
        color="success"
        sx={{ height: "32px" }}
        onAbort={handleSaveClicked}
      >
        Save
      </Button>
    </div>
  );
};
