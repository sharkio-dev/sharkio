import { Button, CircularProgress, Paper, TextField } from "@mui/material";
import { ReactNode } from "react";

type colorType =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning";
type variantType = "text" | "outlined" | "contained";
type sizeType = "small" | "medium" | "large";
interface EditPaperProps {
  paperHeadLine?: string;
  textFieldValue?: string;
  textFieldLabel?: ReactNode;
  textFieldPlaceHolder?: string;
  onChangeTextField?:
    | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  onClickAcceptButton?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  onClickCancelButton?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isLoading?: boolean;
  acceptButtonValue?: string;
  cancelButtonValue?: string;
  acceptButtonColor?: colorType;
  cancelButtonColor?: colorType;
  acceptButtonVariant?: variantType;
  cancelButtonVariant?: variantType;
  acceptButtonSize?: sizeType;
  cancelButtonSize?: sizeType;
  acceptButtonDisabled?: boolean;
  cancelButtonDisabled?: boolean;
}

const EditPaper: React.FC<EditPaperProps> = ({
  paperHeadLine: headLine,
  textFieldLabel: textFiledLabel,
  textFieldPlaceHolder: placeHolder,
  textFieldValue: value,
  onChangeTextField: onChangeText,
  onClickAcceptButton: onAccept,
  onClickCancelButton: onCancel,
  isLoading,
  acceptButtonValue,
  cancelButtonValue,
  acceptButtonColor: acceptButtonCollor = "primary",
  cancelButtonColor: cancelButtonCollor = "primary",
  acceptButtonVariant = "outlined",
  cancelButtonVariant = "outlined",
  acceptButtonSize = "medium",
  cancelButtonSize = "medium",
  acceptButtonDisabled = false,
  cancelButtonDisabled = false,
}) => {
  return (
    <>
      <Paper className="flex flex-col p-4 w-96 rounded-sm">
        <div className="text-2xl font-bold">{headLine}</div>
        <div className="w-full border-b-[0.05px] my-4" />
        <div className="flex flex-col space-y-2">
          <TextField
            label={textFiledLabel}
            placeholder={placeHolder}
            value={value}
            onChange={onChangeText}
            inputProps={{ maxLength: 25 }}
          />
        </div>
        <div className="flex flex-row justify-start mt-4 space-x-2">
          <Button
            onClick={onAccept}
            variant={acceptButtonVariant}
            color={acceptButtonCollor}
            size={acceptButtonSize}
            disabled={acceptButtonDisabled}
          >
            {isLoading ? <CircularProgress size={24} /> : acceptButtonValue}
          </Button>
          <Button
            onClick={onCancel}
            variant={cancelButtonVariant}
            color={cancelButtonCollor}
            size={cancelButtonSize}
            disabled={cancelButtonDisabled}
          >
            {cancelButtonValue}
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default EditPaper;
