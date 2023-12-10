import {
  Modal,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useWorkspaceStore, workSpaceType } from "../../stores/workspaceStore";
import { openModal } from "./WorkspaceSelector";
import EditPaper from "./EditPaper";

interface EditWorkspaceModalProps {
  modalIsOpen: openModal;
  onCancel: () => void;
  workSpace: workSpaceType;
}

const EditWorkspaceModal: React.FC<EditWorkspaceModalProps> = ({
  modalIsOpen,
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
        open={modalIsOpen === "edit"}
        onClose={onCancel}
        closeAfterTransition
        className="flex justify-center items-center border-0"
      >
        <EditPaper
          paperHeadLine="Edit Project"
          textFieldLabel={"Current name: " + workSpace.name}
          textFieldPlaceHolder={workSpace.name}
          textFieldValue={editedWorkSpaceName}
          onChangeTextField={(e) => setEditedWorkSpaceName(e.target.value)}
          onClickAcceptButton={handleEditedProjectSave}
          onClickCancelButton={onCancel}
          isLoading={isLoading}
          acceptButtonValue="Save"
          cancelButtonValue="Cancel"
          acceptButtonColor="success"
          acceptButtonDisabled={isLoading}
        />
      </Modal>
    </>
  );
};

export default EditWorkspaceModal;
