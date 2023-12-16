import React, { useState } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useWorkspaceStore } from "../../stores/workspaceStore";
import GenericEditingModal from "./GenericEditingModal";

interface EditWorkspaceModalProps {
  isModalOpen: boolean;
  onCancel: () => void;
}
const NewWorkspaceModal: React.FC<EditWorkspaceModalProps> = ({
  isModalOpen,
  onCancel,
}) => {
  const [newWorkSpaceName, setNewWorkSpaceName] = useState("");
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { createWorkspace } = useWorkspaceStore();
  const handleNewWorkSpcaeSave = async () => {
    if (newWorkSpaceName === "") {
      showSnackbar("Name cannot be empty or already exists", "error");
      return;
    }
    try {
      setIsLoading(true);
      await createWorkspace(newWorkSpaceName);
      onCancel();
      showSnackbar("workspace added", "success");
    } catch (err) {
      showSnackbar("Error adding new workspace", "error");
      return;
    } finally {
      setIsLoading(false);
      setNewWorkSpaceName("");
    }
  };

  return (
    <>
      {snackBar}
      <GenericEditingModal
        modalProps={{ open: isModalOpen, onClose: onCancel }}
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
