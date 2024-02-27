import { Button } from "@mui/material";
import { EditableNameField } from "./EditableNameProps";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { useFlowStore } from "../../stores/flowStore";
import { LoadingIcon } from "../sniffers/LoadingIcon";

interface FlowNameAndSaveProps {
  isLoading: boolean;
  name: string;
  handleSaveClicked: () => void;
  handleNameChange: (namg: string) => void;
  flowId: string;
  afterRun?: () => void;
}

export const FlowNameAndRun: React.FC<FlowNameAndSaveProps> = ({
  isLoading,
  name,
  handleNameChange,
  handleSaveClicked,
  flowId,
  afterRun,
}) => {
  const { runFlow, isFlowRunning } = useFlowStore();

  const onClickRun = () => {
    runFlow(flowId as string, true).then(() => {
      afterRun && afterRun();
    });
  };
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
        startIcon={isFlowRunning ? <LoadingIcon /> : <AiOutlinePlayCircle />}
        onClick={onClickRun}
      >
        Run
      </Button>
    </div>
  );
};
