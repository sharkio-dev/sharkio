import { useState } from "react";
import { Modal, Paper, TextField, Button } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
import { createSniffer } from "../../api/api";
import { CircularProgress } from "@mui/material";

type AddSnifferModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
export const AddSnifferModal = ({ isOpen, onClose }: AddSnifferModalProps) => {
  const [name, setName] = useState<string>("");
  const [downstreamUrl, setDownstreamUrl] = useState<string>("");
  const [port, setPort] = useState<number>();
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddSniffer = () => {
    if (name === "") {
      showSnackbar("Name cannot be empty", "error");
      return;
    }
    if (downstreamUrl === "") {
      showSnackbar("Downstream Url cannot be empty", "error");
      return;
    }

    setIsLoading(true);
    createSniffer({ name, downstreamUrl, port: Number(port) })
      .then(() => {
        setName("");
        setDownstreamUrl("");
        onClose();
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error updating sniffer", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {snackBar}
      <Modal
        open={isOpen}
        onClose={onClose}
        className="flex justify-center items-center"
      >
        <Paper className="flex flex-col p-4 w-96 rounded-sm">
          <div className="text-2xl font-bold">Add Sniffer</div>
          <div className="w-full border-b-[0.05px] my-4" />
          <div className="flex flex-col space-y-2">
            <TextField
              label={"Name"}
              placeholder="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <TextField
              label={"Downstream Url"}
              placeholder="http://example.com"
              value={downstreamUrl}
              onChange={(event) => setDownstreamUrl(event.target.value)}
            />
            <TextField
              label={"Port"}
              placeholder="Port"
              value={port}
              type="number"
              onChange={(event) => setPort(parseInt(event.target.value))}
            />
          </div>

          <div className="flex flex-row justify-end mt-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSniffer}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Add"}
            </Button>
          </div>
        </Paper>
      </Modal>
    </>
  );
};
