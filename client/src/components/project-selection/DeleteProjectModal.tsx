import { useEffect, useState } from "react";
import { Modal, Paper, TextField, Button } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
import { CircularProgress } from "@mui/material";
import { deleteProject } from "../../api/api";

type DeleteProjectModalProps = {
  projectName: string;
  open: boolean;
  onCancel: () => void;
};
export const DeleteProjectModal = ({
  projectName,
  open,
  onCancel,
}: DeleteProjectModalProps) => {
  const [verifyDelete, setVerifyDelete] = useState("");
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDeleteProjectAccept = () => {
    console.log("try delete", projectName, verifyDelete);
    if (projectName !== verifyDelete) {
      showSnackbar("Please type the name of the project to delete", "error");
      return;
    }
    setIsLoading(true);
    deleteProject(projectName) //api call
      .then(() => {
        onCancel;
      })
      .catch(() => {
        showSnackbar("Error deleting project", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setVerifyDelete(" ");
  }, [projectName]);

  return (
    <>
      {snackBar}
      <Modal
        open={open}
        onClose={onCancel}
        className="flex justify-center items-center border-0"
      >
        <Paper className="flex flex-col p-4 w-96 rounded-sm">
          <div className="text-2xl font-bold">Delete Project</div>
          <div className="w-full border-b-[0.05px] my-4" />
          <div className="flex flex-col space-y-2">
            <TextField
              label={"Delete: " + projectName}
              placeholder={`Type "${projectName}" to delete`}
              value={verifyDelete}
              onChange={(event) => setVerifyDelete(event.target.value)}
            />
          </div>

          <div className="flex flex-row  mt-4 space-x-2">
            <Button
              variant="contained"
              color="error"
              disabled={isLoading}
              onClick={handleDeleteProjectAccept}
            >
              {isLoading ? <CircularProgress size={24} /> : "Delete"}
            </Button>
            <Button onClick={onCancel} variant="outlined" color="primary">
              {isLoading ? <CircularProgress size={24} /> : "Cancel"}
            </Button>
          </div>
        </Paper>
      </Modal>
    </>
  );
};
