import { Button, Modal, Paper, TextField } from "@mui/material";
import React from "react";

interface EditProjectModalProps {
  open: boolean;
  onCancel: () => void;
  onSave: () => void;
  setNewProjectName: React.Dispatch<React.SetStateAction<string>>;
}
const NewProjectModal: React.FC<EditProjectModalProps> = ({
  open,
  onCancel,
  onSave,
  setNewProjectName,
}) => {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      closeAfterTransition
      className="flex justify-center items-center border-0"
    >
      <Paper className="flex flex-col p-4 w-96 rounded-sm">
        <div className="text-2xl font-bold">Add New Project</div>
        <div className="w-full border-b-[0.05px] my-4" />
        <div className="flex flex-col space-y-2">
          <TextField
            label={"Project Name"}
            placeholder="Project Name"
            onChange={(e) => setNewProjectName(e.target.value)}
            inputProps={{ maxLength: 25 }}
          />
        </div>
        <div className="flex flex-row justify-start  mt-4">
          <Button onClick={onSave}>Add</Button>
          <Button onClick={onCancel}>Cancel</Button>
        </div>
      </Paper>
    </Modal>
  );
};

export default NewProjectModal;
