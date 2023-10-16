import { Edit, Save } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";
import React from "react";

export const EditProxyButton = ({
  onEdit,
  onSave,
  disabled,
  canEdit,
}: {
  onEdit: () => void;
  onSave: () => void;
  disabled: boolean;
  canEdit: boolean;
}) => {
  return (
    <>
      {canEdit && (
        <Tooltip title={"Edit Proxy"}>
          <button
            onClick={onEdit}
            disabled={disabled}
            className="px-2 cursor-pointer"
          >
            <Edit color={disabled ? "disabled" : "info"} />
          </button>
        </Tooltip>
      )}
      {!canEdit && (
        <Tooltip title="Save Proxy">
          <button
            disabled={disabled}
            onClick={onSave}
            className="px-2 cursor-pointer"
          >
            <Save color={disabled ? "disabled" : "info"} />
          </button>
        </Tooltip>
      )}
    </>
  );
};
