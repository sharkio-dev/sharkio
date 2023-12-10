import React, { useState } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useWorkspaceStore } from "../../stores/workspaceStore";
import { openModal } from "./WorkspaceSelector";
import EditingModal from "./EditingModal";

interface EditWorkspaceModalProps {
  modalIsOpen: openModal;
  onCancel: () => void;
}
const NewWorkspaceModal: React.FC<EditWorkspaceModalProps> = ({
  modalIsOpen,
  onCancel,
}) => {
  const [newWorkSpaceName, setNewWorkSpaceName] = useState("");
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { createWorkspace, getWorkspaces } = useWorkspaceStore();
  const handleNewWorkSpcaeSave = () => {
    if (newWorkSpaceName === "") {
      showSnackbar("Name cannot be empty or already exists", "error");
      return;
    }
    setIsLoading(true);
    createWorkspace(newWorkSpaceName) //api call
      .then(() => {
        onCancel(), showSnackbar("workspace added", "success");
      })
      .catch(() => showSnackbar("Error adding new workspace", "error"))
      .finally(() => {
        setIsLoading(false);
        getWorkspaces();
      });
    setNewWorkSpaceName("");
  };

  return (
    <>
      {snackBar}
      <EditingModal
        modalProps={{ open: modalIsOpen === "create", onClose: onCancel }}
        paperHeadLine="Add New Project"
        textFieldProps={{
          placeholder: "Workspace Name",
          label: "Workspace Name",
          onChange: (e) => setNewWorkSpaceName(e.target.value),
        }}
        acceptButtonValue="Add"
        acceptButtonProps={{
          onClick: handleNewWorkSpcaeSave,
          disabled: isLoading,
        }}
        cancelButtonProps={{
          onClick: onCancel,
          disabled: isLoading,
        }}
        isLoading={isLoading}
      />
    </>
  );
};

export default NewWorkspaceModal;
