import {
  Button,
  CircularProgress,
  Modal,
  Paper,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useWorkspaceStore, workSpaceType } from "../../stores/workspaceStore";

interface EditProjectModalProps {
  open: boolean;
  onCancel: () => void;
  workSpace: workSpaceType;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  open,
  onCancel,
  workSpace,
}) => {
  const [editedWorkSpaceName, setEditedWorkSpaceName] = useState("");
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { editWorkSpaceName } = useWorkspaceStore();
  const handleEditedProjectSave = () => {
    console.log(
      "try edit - " + "to edit:" + workSpace.name,
      "edited:" + editedWorkSpaceName
    );
    if (editedWorkSpaceName === "" || workSpace.name === editedWorkSpaceName) {
      showSnackbar("Name cannot be empty or the same", "error");
      return;
    }

    setIsLoading(true);
    editWorkSpaceName(editedWorkSpaceName, workSpace.id) //api call
      .then(() => {
        onCancel(), showSnackbar("Project edited", "success");
      })
      .catch(() => showSnackbar("Error editing project", "error"))
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setEditedWorkSpaceName(workSpace.name);
  }, [workSpace]);

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
              label={"Current name: " + workSpace.name}
              placeholder={workSpace.name}
              value={editedWorkSpaceName}
              onChange={(e) => setEditedWorkSpaceName(e.target.value)}
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
