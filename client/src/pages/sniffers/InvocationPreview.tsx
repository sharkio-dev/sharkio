import React from "react";
import { Modal, Paper, Typography, Button } from "@mui/material";
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
    <Modal className="grid" open={open} onClose={onClose}>
      <Paper>
        <ResponseSection response={response} />
        <Button onClick={onClose}>Close</Button>
      </Paper>
    </Modal>
  );
};

export default InvocationPreview;
