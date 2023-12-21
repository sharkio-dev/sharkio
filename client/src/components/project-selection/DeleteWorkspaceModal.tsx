import { useEffect, useState } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useWorkspaceStore, workSpaceType } from "../../stores/workspaceStore";
import GenericEditingModal from "./GenericEditingModal";
import { useLocation, useNavigate } from "react-router-dom";
import { emptyWorkSpace } from "./WorkspaceSelector";
import queryString from "query-string";

type DeleteWorkspaceModalProps = {};
export const DeleteWorkspaceModal = ({}: DeleteWorkspaceModalProps) => {
  const [verifyDelete, setVerifyDelete] = useState("");
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { deleteWorkspace, workspaces } = useWorkspaceStore();
  const [workspace, setWorkspace] = useState<workSpaceType>(emptyWorkSpace);

  const { deletedWorkspaceId } = queryString.parse(useLocation().search);

  useEffect(() => {
    setVerifyDelete("");
    const existedWorkspace = workspaces.find(
      (w) => w.id === deletedWorkspaceId
    );
    if (existedWorkspace) {
      setWorkspace(existedWorkspace);
    }
  }, [deletedWorkspaceId]);

  const handleCancelClick = () => {
    setWorkspace(emptyWorkSpace);
  };

  const handleDeleteProjectAccept = () => {
    if (workspace.name !== verifyDelete) {
      showSnackbar("Please type the name of the workspace to delete", "error");
      return;
    }
    setIsLoading(true);
    deleteWorkspace(workspace.id)
      .then(() => {
        handleCancelClick(), showSnackbar("workspace deleted", "success");
      })
      .catch((e) => {
        console.log(e);
        showSnackbar("Error deleting workspace", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {snackBar}
      <GenericEditingModal
        modalProps={{
          open: workspace.id !== "",
          onClose: handleCancelClick,
        }}
        paperHeadLine="Delete Project"
        textFieldProps={{
          placeholder: `Type "${workspace.name}" to delete`,
          label: "Delete: " + workspace.name,
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
          onClick: handleCancelClick,
        }}
        cancelButtonValue="Cancel"
        isLoading={isLoading}
      />
    </>
  );
};
