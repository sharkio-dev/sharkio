import { Button, Modal, Paper, TextField } from "@mui/material";
import React, { useCallback } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { editKey } from "../../api/apiKeys";

type EditTokenModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  name: string;
  keyId: string;
};
export const EditTokenModal = ({
  isOpen,
  onClose,
  onSubmit,
  name,
  keyId,
}: EditTokenModalProps) => {
  const [newName, setNewName] = React.useState<string>(name);
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  console.log(newName);

  const submit = useCallback(() => {
    editKey(keyId, newName)
      .then((res) => {
        onSubmit();
        showSnackbar("API key edited successfully", "success");
        setNewName("");
        onClose();
      })
      .catch(() => {
        showSnackbar("Error editing API key", "error");
      });
  }, [keyId, name, onSubmit, showSnackbar]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  return (
    <>
      {snackBar}
      <Modal
        open={isOpen}
        onClose={onClose}
        className="flex justify-center items-center"
      >
        <Paper className="flex flex-col p-4 w-96">
          <div className="text-2xl font-bold">Edit API Key Name</div>
          <div className="w-full border-b-[0.05px] my-4" />
          <TextField
            label="Name"
            variant="outlined"
            className="mb-4"
            value={newName}
            onChange={onChange}
          />
          <div className="flex flex-row justify-end mt-4">
            <Button variant="contained" color="primary" onClick={submit}>
              Submit
            </Button>
          </div>
        </Paper>
      </Modal>
    </>
  );
};
