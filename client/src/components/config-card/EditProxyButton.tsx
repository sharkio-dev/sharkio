import { Edit, Save } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

export const EditProxyButton = ({
  onEdit,
  onSave,
  disabled,
  isEditing,
}: {
  onEdit: () => void;
  onSave: () => void;
  disabled: boolean;
  isEditing: boolean;
}) => {
  return (
    <>
      {isEditing && (
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
      {!isEditing && (
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
