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

  const navigate = useNavigate();
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

  const handleModalClose = () => {
    navigate(-1);
  };

  const handleDeleteProjectAccept = () => {
    if (workspace.name !== verifyDelete) {
      showSnackbar("Please type the name of the workspace to delete", "error");
      return;
    }
    setIsLoading(true);
    deleteWorkspace(workspace.id)
      .then(() => {
        handleModalClose(), showSnackbar("workspace deleted", "success");
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
          open: deletedWorkspaceId ? true : false,
          onClose: handleModalClose,
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
          onClick: handleModalClose,
        }}
        cancelButtonValue="Cancel"
        isLoading={isLoading}
      />
    </>
  );
};
