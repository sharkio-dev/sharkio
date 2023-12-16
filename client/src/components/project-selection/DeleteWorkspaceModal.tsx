import { useEffect, useState } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useWorkspaceStore, workSpaceType } from "../../stores/workspaceStore";
import GenericEditingModal from "./GenericEditingModal";

type DeleteWorkspaceModalProps = {
  workSpace: workSpaceType;
  isModalOpen: boolean;
  onCancel: () => void;
};
export const DeleteWorkspaceModal = ({
  workSpace,
  isModalOpen,
  onCancel,
}: DeleteWorkspaceModalProps) => {
  const [verifyDelete, setVerifyDelete] = useState("");
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { deleteWorkspace } = useWorkspaceStore();

  const handleDeleteProjectAccept = () => {
    if (workSpace.name !== verifyDelete) {
      showSnackbar("Please type the name of the workspace to delete", "error");
      return;
    }
    setIsLoading(true);
    deleteWorkspace(workSpace.id)
      .then(() => {
        onCancel(), showSnackbar("workspace deleted", "success");
      })
      .catch((e) => {
        console.log(e);
        showSnackbar("Error deleting workspace", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setVerifyDelete("");
  }, [workSpace]);

  return (
    <>
      {snackBar}
      <GenericEditingModal
        modalProps={{
          open: isModalOpen,
          onClose: onCancel,
        }}
        paperHeadLine="Delete Project"
        textFieldProps={{
          placeholder: `Type "${workSpace.name}" to delete`,
          label: "Delete: " + workSpace.name,
          value: verifyDelete,
          onChange: (e) => setVerifyDelete(e.target.value),
        }}
        acceptButtonProps={{
          onClick: handleDeleteProjectAccept,
          disabled: isLoading,
          color: "error",
        }}
        acceptButtonValue="Delete"
        cancelButtonProps={{
          onClick: onCancel,
        }}
        cancelButtonValue="Cancel"
        isLoading={isLoading}
      />
    </>
  );
};