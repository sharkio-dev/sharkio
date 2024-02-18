import React from "react";
import { Modal, Paper, Button } from "@mui/material";
import { ResponseSection } from "../sniffers/InvocationDetails";
import { getInvocation } from "../../api/api";
import TabPanel from "@mui/lab/TabPanel";

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
      className="flex justify-center items-center rounded-full text-gray-300"
      open={open}
      onClose={onClose}
    >
      <Paper
        sx={{ backgroundColor: "#232323" }}
        className="flex flex-col p-4 w-6/12 bg-gray-800"
      >
        <ResponseSection response={{ ...previewData }} />
        <Button className="flex" onClick={onClose}>
          Close
        </Button>
      </Paper>
    </Modal>
  );
};

export default InvocationPreview;
