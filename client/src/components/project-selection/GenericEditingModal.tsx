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
  isLoading: boolean;
  className?: string;
  paperHeadLine?: string;
  textFieldProps?: Partial<TextFieldProps>;
  acceptButtonProps?: Partial<ExtendButtonBase<ButtonTypeMap>>;
  acceptButtonValue?: string;
  cancelButtonProps?: Partial<ExtendButtonBase<ButtonTypeMap>>;
  cancelButtonValue?: string;
  children?: React.ReactNode;
}

const GenericEditingModal: React.FC<EditingModalProps> = ({
  className,
  paperHeadLine: headLine,
  acceptButtonProps,
  cancelButtonProps,
  textFieldProps,
  isLoading,
  acceptButtonValue,
  cancelButtonValue = "Cancel",
  modalProps,
  children,
}) => {
  return (
    <Modal
      closeAfterTransition
      className={`${className} flex justify-center items-center border-0`}
      {...modalProps}
    >
      <Paper className="flex flex-col p-4 w-fit h-fit rounded-sm min-w-[400px] min-h-[200px]">
        <div className="text-2xl font-bold">{headLine}</div>
        <div className="w-full border-b-[0.05px] my-4" />
        <div className="flex flex-col space-y-2">
          {children ?? (
            <TextField inputProps={{ maxLength: 25 }} {...textFieldProps} />
          )}
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
