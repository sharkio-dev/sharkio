import React from "react";
import { Modal, Paper, Button } from "@mui/material";
import { ResponseSection } from "../sniffers/InvocationDetails";

type InvocationPreviewProps = {
  open: boolean;
  onClose: () => void;
  response: any;
};

export const InvocationPreview: React.FC<InvocationPreviewProps> = ({
  open,
  onClose,
  response,
}) => {
  return (
    <Modal
      className="flex rounded-md w-4/5 mx-auto justify-center items-center"
      open={open}
      onClose={onClose}
    >
      <Paper>
        <ResponseSection response={response} />
        <Button className="flex" onClick={onClose}>
          Close
        </Button>
      </Paper>
    </Modal>
  );
};

export default InvocationPreview;
