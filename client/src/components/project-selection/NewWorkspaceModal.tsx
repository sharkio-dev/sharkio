import React, { useEffect, useState } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useWorkspaceStore } from "../../stores/workspaceStore";
import GenericEditingModal from "./GenericEditingModal";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";

interface EditWorkspaceModalProps {}

const NewWorkspaceModal: React.FC<EditWorkspaceModalProps> = ({}) => {
  const [newWorkSpaceName, setNewWorkSpaceName] = useState("");
  const { show: showSnackbar, component: SnackbarComponent } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const { createWorkspace, openWorkspace } = useWorkspaceStore();

  const navigate = useNavigate();
  const { addWorkspace } = queryString.parse(useLocation().search);

  const handleModalClose = () => {
    navigate(-1);
  };
  const handleNewWorkspaceSave = async () => {
    if (newWorkSpaceName === "") {
      showSnackbar("Name cannot be empty or already exists", "error");
      return;
    }

    try {
      setIsLoading(true);
      await createWorkspace(newWorkSpaceName);
      handleModalClose();
      showSnackbar("Workspace added", "success");
    } catch (err) {
      showSnackbar("Error adding new workspace", "error");
    } finally {
      setIsLoading(false);
      setNewWorkSpaceName("");
    }
  };

  const modalProps = {
    open: addWorkspace ? true : false,
    onClose: handleModalClose,
  };
  const textFieldProps = {
    placeholder: "Workspace Name",
    label: "Workspace Name",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setNewWorkSpaceName(e.target.value),
  };
  const acceptButtonProps = {
    onClick: handleNewWorkspaceSave,
    disabled: isLoading,
  };
  const cancelButtonProps = { onClick: handleModalClose, disabled: isLoading };

  return (
    <>
      {SnackbarComponent}
      <GenericEditingModal
        modalProps={modalProps}
        paperHeadLine="Add New Project"
        textFieldProps={textFieldProps}
        acceptButtonValue="Add"
        acceptButtonProps={acceptButtonProps}
        cancelButtonProps={cancelButtonProps}
        isLoading={isLoading}
      />
    </>
  );
};

export default NewWorkspaceModal;
