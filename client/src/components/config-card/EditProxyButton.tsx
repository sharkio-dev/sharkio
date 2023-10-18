import { Edit, Save } from "@mui/icons-material";
import { ConfigButton } from "./ConfigButton";

export const EditProxyButton = ({
  onEdit,
  onSave,
  disabled,
  isEditing,
  isLoading,
}: {
  onEdit: () => void;
  onSave: () => void;
  disabled?: boolean;
  isEditing: boolean;
  isLoading?: boolean;
}) => {
  console.log(isEditing);
  return (
    <>
      {isEditing && (
        <ConfigButton
          tooltip={"Save Proxy"}
          onClick={onSave}
          disabled={disabled}
          isLoading={isLoading}
        >
          <Save color={disabled ? "disabled" : "info"} />
        </ConfigButton>
      )}
      {!isEditing && (
        <ConfigButton
          tooltip={"Edit Proxy"}
          onClick={onEdit}
          disabled={disabled}
          isLoading={isLoading}
        >
          <Edit color={disabled ? "disabled" : "info"} />
        </ConfigButton>
      )}
    </>
  );
};
