import { useState, useCallback } from "react";
import { Modal, Paper, TextField, Button } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
import { CircularProgress } from "@mui/material";
import { SnifferType, useSniffersStore } from "../../stores/sniffersStores";

type EdirSnifferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sniffer: SnifferType;
};
export const EditSnifferModal = ({
  isOpen,
  onClose,
  sniffer,
}: EdirSnifferModalProps) => {
  const [name, setName] = useState<string>(sniffer.name);
  const [downstreamUrl, setDownstreamUrl] = useState<string>(
    sniffer.downstreamUrl,
  );
  const [subdomain, setSubdomain] = useState<string>(
    sniffer.subdomain.split("-")[1],
  );
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { editSniffer } = useSniffersStore();

  const handleEditSniffer = useCallback(() => {
    if (name === "") {
      showSnackbar("Name cannot be empty", "error");
      return;
    }
    if (downstreamUrl === "") {
      showSnackbar("Downstream Url cannot be empty", "error");
      return;
    }
    setIsLoading(true);
    editSniffer({
      name,
      downstreamUrl,
      id: sniffer.id,
      subdomain: name + "-" + subdomain,
    })
      .then(() => {
        setName("");
        setDownstreamUrl("");
        setSubdomain("");
        onClose();
      })
      .catch(() => {
        showSnackbar("Error creating sniffer", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [name, downstreamUrl, sniffer, showSnackbar, onClose]);

  return (
    <>
      {snackBar}
      <Modal
        open={isOpen}
        onClose={onClose}
        className="flex justify-center items-center border-0"
      >
        <Paper className="flex flex-col p-4 w-96 rounded-sm">
          <div className="text-2xl font-bold">Edit Sniffer</div>
          <div className="w-full border-b-[0.05px] my-4" />
          <div className="flex flex-col space-y-2">
            <TextField
              label={"Name"}
              placeholder="name"
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
              label={"Subdomain"}
              placeholder="subdomain"
              value={name + "-" + subdomain}
              onChange={(event) => setSubdomain(event.target.value)}
              disabled={true}
            />
          </div>

          <div className="flex flex-row justify-end mt-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditSniffer}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </div>
        </Paper>
      </Modal>
    </>
  );
};
