import {
  Button,
  CircularProgress,
  Modal,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { putEditProject } from "../../api/api";

interface EditProjectModalProps {
  open: boolean;
  onCancel: () => void;
  ProjectToEditName: string;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  open,
  onCancel,
  ProjectToEditName,
}) => {
  const [editedProjectName, setEditedProjectName] = useState("");
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleEditedProjectSave = () => {
    console.log(
      "try edit - " + "to edit:" + ProjectToEditName,
      "edited:" + editedProjectName,
    );
    if (editedProjectName === "" || ProjectToEditName === editedProjectName) {
      showSnackbar("Name cannot be empty or the same", "error");
      return;
    }

    setIsLoading(true);
    putEditProject(editedProjectName, ProjectToEditName) //api call
      .then(() => onCancel)
      .catch(() => showSnackbar("Error editing project", "error"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setEditedProjectName(ProjectToEditName);
  }, [ProjectToEditName]);

  return (
    <>
      {snackBar}
      <Modal
        open={open}
        onClose={onCancel}
        closeAfterTransition
        className="flex justify-center items-center border-0"
      >
        <Paper className="flex flex-col p-4 w-96 rounded-sm">
          <div className="text-2xl font-bold">Edit project name</div>
          <div className="w-full border-b-[0.05px] my-4" />
          <div className="flex flex-col space-y-2">
            <TextField
              label={"Current name: " + ProjectToEditName}
              placeholder={ProjectToEditName}
              value={editedProjectName}
              onChange={(e) => setEditedProjectName(e.target.value)}
              inputProps={{ maxLength: 25 }}
            />
          </div>
          <div className="flex flex-row justify-start mt-4 space-x-2">
            <Button
              onClick={handleEditedProjectSave}
              variant="outlined"
              color="success"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Save"}
            </Button>
            <Button onClick={onCancel} variant="outlined">
              {isLoading ? <CircularProgress size={24} /> : "Cancel"}
            </Button>
          </div>
        </Paper>
      </Modal>
    </>
  );
};

export default EditProjectModal;
