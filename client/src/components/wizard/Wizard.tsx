import React from "react";
import { Modal, Paper } from "@mui/material";
import { WizardMenu } from "./WizardMenu";

interface WizardProps {
  handleSelection: (text: string) => void;
  open: boolean;
  onClose: () => void;
  showFakeData?: boolean;
  showTemplates?: boolean;
  showPreviousSteps?: boolean;
  showAi?: boolean;
}
export const Wizard: React.FC<WizardProps> = ({
  handleSelection,
  open,
  onClose,
  showFakeData,
  showAi,
  showPreviousSteps,
  showTemplates,
}) => {
  return (
    <Modal
      open={open}
      className="flex justify-center items-center border-0"
      onClose={onClose}
    >
      <Paper className="flex flex-col w-96 rounded-sm outline-none p-4">
        <WizardMenu
          handleSelection={handleSelection}
          onClose={onClose}
          showAi={showAi}
          showFakeData={showFakeData}
          showPreviousSteps={showPreviousSteps}
          showTemplates={showTemplates}
        />
      </Paper>
    </Modal>
  );
};
