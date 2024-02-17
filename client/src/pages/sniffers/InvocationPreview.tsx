import React from "react";
import { Modal, Paper, Button } from "@mui/material";
import { ResponseSection } from "../sniffers/InvocationDetails";
import { BackendAxios } from "../../api/backendAxios";
import { getInvocation } from "../../api/api";

type InvocationPreviewProps = {
  open: boolean;
  onClose: () => void;
  invocationId: string;
};

export const InvocationPreview: React.FC<InvocationPreviewProps> = ({
  open,
  onClose,
  invocationId,
}) => {
  const [previewData, setPreviewData] = React.useState({
    status: 0,
    body: "",
    headers: {},
  });
  React.useEffect(() => {
    getInvocation(invocationId).then((res) => {
      if (res) {
        const { status, headers, body } = res.response;
        setPreviewData({ status, headers, body });
      }
    });
  }, []);
  return (
    <Modal
      className="flex rounded-md w-2/3 mx-auto justify-center items-center"
      open={open}
      onClose={onClose}
    >
      <Paper>
        <ResponseSection response={{ ...previewData }} />
        <Button className="flex" onClick={onClose}>
          Close
        </Button>
      </Paper>
    </Modal>
  );
};

export default InvocationPreview;
