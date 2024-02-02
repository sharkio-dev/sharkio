import { Button } from "@mui/material";
import { EditableNameField } from "./EditableNameProps";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { useFlowStore } from "../../stores/flowStore";
import { useParams } from "react-router-dom";

interface FlowNameAndSaveProps {
  isLoading: boolean;
  name: string;
  handleSaveClicked: () => void;
  handleNameChange: (namg: string) => void;
}

export const FlowNameAndRun: React.FC<FlowNameAndSaveProps> = ({
  isLoading,
  name,
  handleNameChange,
  handleSaveClicked,
}) => {
  const { flowId } = useParams();
  const { runFlow } = useFlowStore();
  return (
    <div className="flex flex-row items-center justify-between">
      <EditableNameField
        isLoading={isLoading}
        name={name}
        handleNameChange={handleNameChange}
        handleSaveClicked={handleSaveClicked}
      />

      <Button
        variant="text"
        color="success"
        size="small"
        startIcon={<AiOutlinePlayCircle />}
        onClick={() => runFlow(flowId as string)}
      >
        Run
      </Button>
    </div>
  );
};
