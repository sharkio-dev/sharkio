import {
  Button,
  CircularProgress,
  Modal,
  Paper,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useSniffersStore } from "../../stores/sniffersStores";
import randomString from "random-string";

type AddSnifferModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
export const AddSnifferModal = ({ isOpen, onClose }: AddSnifferModalProps) => {
  const [name, setName] = useState<string>("");
  const [downstreamUrl, setDownstreamUrl] = useState<string>("");

  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [subdomain, setSubdomain] = useState<string>(
    randomString({ length: 5 }).toLowerCase(),
  );
  const { createSniffer } = useSniffersStore();

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
    createSniffer({
      name,
      downstreamUrl,
      port: 0,
      subdomain: `${name}-${subdomain}`,
    })
      .then(() => {
        setName("");
        setDownstreamUrl("");
        onClose();
      })
      .catch(() => {
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
        className="flex justify-center items-center border-0"
      >
        <Paper className="flex flex-col p-4 w-96 rounded-sm border-0">
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
              label={"Target Url"}
              placeholder="http://example.com"
              value={downstreamUrl}
              onChange={(event) => setDownstreamUrl(event.target.value)}
            />
            <TextField
              label={"Subdomain"}
              placeholder="Subdomain"
              value={name + "-" + subdomain}
              disabled={true}
              onChange={(event) => setSubdomain(event.target.value)}
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
