import { useState } from "react";
import {
  Button,
  InputAdornment,
  OutlinedInput,
  OutlinedInputProps,
  Tooltip,
} from "@mui/material";
import { RxMagicWand } from "react-icons/rx";
import { Wizard } from "../../components/wizard/Wizard";
import React from "react";

interface InputWithWizardProps {
  inputProps: OutlinedInputProps;
  handleWizardSelection: (text: string) => void;
}
export const InputWithWizard: React.FC<InputWithWizardProps> = ({
  inputProps,
  handleWizardSelection,
}) => {
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <OutlinedInput
      className="border border-border-color rounded-md w-full"
      placeholder="Value"
      size="small"
      {...inputProps}
      endAdornment={
        <InputAdornment position="end">
          <Button
            variant="text"
            color="secondary"
            sx={{ minWidth: 0, borderRadius: "50%" }}
            onClick={() => setWizardOpen(true)}
            size="small"
          >
            <Tooltip title="Generate Data" placement="top">
              <div className="h-4 w-4 items-center justify-center">
                <RxMagicWand className="text-lg" />
              </div>
            </Tooltip>
          </Button>
          <Wizard
            handleSelection={handleWizardSelection}
            open={wizardOpen}
            onClose={() => setWizardOpen(false)}
            showAi={false}
            showFakeData={true}
            showPreviousSteps={true}
            showTemplates={false}
          />
        </InputAdornment>
      }
    />
  );
};
