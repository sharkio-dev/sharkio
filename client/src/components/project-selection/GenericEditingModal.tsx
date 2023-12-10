import {
  Button,
  ButtonTypeMap,
  CircularProgress,
  ExtendButtonBase,
  Modal,
  ModalProps,
  Paper,
  TextField,
  TextFieldProps,
} from "@mui/material";

interface EditingModalProps {
  modalProps: Partial<ModalProps<"div", {}>> & { open: boolean };
  paperHeadLine?: string;
  textFieldProps: Partial<TextFieldProps>;
  acceptButtonProps: Partial<ExtendButtonBase<ButtonTypeMap>>;
  acceptButtonValue?: string;
  cancelButtonProps: Partial<ExtendButtonBase<ButtonTypeMap>>;
  cancelButtonValue?: string;
  isLoading: boolean;
}

const GenericEditingModal: React.FC<EditingModalProps> = ({
  paperHeadLine: headLine,
  acceptButtonProps,
  cancelButtonProps,
  textFieldProps,
  isLoading,
  acceptButtonValue,
  cancelButtonValue = "Cancel",
  modalProps,
}) => {
  return (
    <Modal
      closeAfterTransition
      className="flex justify-center items-center border-0"
      {...modalProps}
    >
      <Paper className="flex flex-col p-4 w-96 rounded-sm">
        <div className="text-2xl font-bold">{headLine}</div>
        <div className="w-full border-b-[0.05px] my-4" />
        <div className="flex flex-col space-y-2">
          <TextField inputProps={{ maxLength: 25 }} {...textFieldProps} />
        </div>
        <div className="flex flex-row justify-start mt-4 space-x-2">
          <Button color="success" {...acceptButtonProps}>
            {isLoading ? <CircularProgress size={24} /> : acceptButtonValue}
          </Button>
          <Button {...cancelButtonProps}>{cancelButtonValue}</Button>
        </div>
      </Paper>
    </Modal>
  );
};

export default GenericEditingModal;
