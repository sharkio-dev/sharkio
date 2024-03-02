import React from "react";
import { Tooltip } from "@mui/material";
import { PiGraphLight } from "react-icons/pi";
import { ImportTestStepDialog } from "./ImpotTestStepDialog";
import { InvocationType } from "../sniffers/types";

type ImportToFlowDialogProps = {
  setIsImportStepDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isImportStepDialogOpen: boolean;
  invocations: (InvocationType | undefined)[];
  iconSize: number;
};

export const ImportToFlowDialog: React.FC<ImportToFlowDialogProps> = ({
  setIsImportStepDialogOpen,
  isImportStepDialogOpen,
  invocations,
  iconSize,
}) => {
  return (
    <Tooltip title="Import to test flow">
      <div>
        <>
          <PiGraphLight
            onClick={() => setIsImportStepDialogOpen(true)}
            className="text-blue-400 cursor-pointer"
            size={iconSize}
          />
          {isImportStepDialogOpen && (
            <ImportTestStepDialog
              invocations={invocations}
              open={isImportStepDialogOpen}
              handleClose={() => {
                setIsImportStepDialogOpen(false);
              }}
            />
          )}
        </>
      </div>
    </Tooltip>
  );
};
