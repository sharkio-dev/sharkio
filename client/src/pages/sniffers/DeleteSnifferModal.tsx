import { useState, useCallback } from "react";
import { Modal, Paper, TextField, Button } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
import { CircularProgress } from "@mui/material";
import { Sniffer, useSniffersStore } from "../../stores/sniffersStores";

type DeleteSnifferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sniffer: Sniffer;
};
export const DeleteSnifferModal = ({
  isOpen,
  onClose,
  sniffer,
}: DeleteSnifferModalProps) => {
  const [verifyDelete, setVerifyDelete] = useState("");
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { deleteSniffer } = useSniffersStore();

  const handleDeleteSniffer = useCallback(() => {
    // TODO: port should not be required
    if (sniffer.name !== verifyDelete) {
      showSnackbar("Please type the name of the sniffer to delete", "error");
      return;
    }
    setIsLoading(true);
    deleteSniffer(sniffer.id)
      .then(() => {
        onClose();
      })
      .catch(() => {
        showSnackbar("Error deleting sniffer", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [showSnackbar, onClose, verifyDelete, sniffer]);

  return (
    <>
      {snackBar}
      <Modal
        open={isOpen}
        onClose={onClose}
        className="flex justify-center items-center border-0"
      >
        <Paper className="flex flex-col p-4 w-96 rounded-sm">
          <div className="text-2xl font-bold">Delete Sniffer</div>
          <div className="w-full border-b-[0.05px] my-4" />
          <div className="flex flex-col space-y-2">
            <TextField
              label={"Delete"}
              placeholder={`Type "${sniffer.name}" to delete`}
              value={verifyDelete}
              onChange={(event) => setVerifyDelete(event.target.value)}
            />
          </div>

          <div className="flex flex-row justify-end mt-4">
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSniffer}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Delete"}
            </Button>
          </div>
        </Paper>
      </Modal>
    </>
  );
};
