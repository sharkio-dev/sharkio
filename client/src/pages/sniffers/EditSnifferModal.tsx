import { useState, useCallback } from "react";
import { Modal, Paper, TextField, Button } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
import { CircularProgress } from "@mui/material";
import { SnifferType, useSniffersStore } from "../../stores/sniffersStores";
import React from "react";
import { validateHttpUrlFormat } from "../../utils/ValidateHttpUrl";

const splitByLast = (str: string, delimiter: string) => {
  const lastIndex = str.lastIndexOf(delimiter);

  if (lastIndex === -1) {
    return [str]; // delimiter not found, return the original string as a single element in an array
  }

  const firstPart = str.substring(0, lastIndex);
  const secondPart = str.substring(lastIndex + 1); // +1 to exclude the delimiter itself

  return [firstPart, secondPart];
};

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
    splitByLast(sniffer.subdomain, "-")[1],
  );
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { editSniffer } = useSniffersStore();
  const [error, setError] = React.useState<string | null>(null);

  const handleUrlEdit = (newValue: string) => {
    setDownstreamUrl(newValue);

    if (!validateHttpUrlFormat(newValue)) {
      setError("Please enter a valid URL.");
    } else {
      setError(null);
    }
  };

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
      name: name.toLowerCase().replace(/\s/g, "-"),
      downstreamUrl,
      id: sniffer.id,
      subdomain: sniffer.name + "-" + subdomain,
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
              onChange={(event) => handleUrlEdit(event.target.value)}
              error={Boolean(error)}
              helperText={error}
            />
            <TextField
              label={"Subdomain"}
              placeholder="subdomain"
              value={sniffer.subdomain}
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
