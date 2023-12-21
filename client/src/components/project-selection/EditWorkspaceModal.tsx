import { useEffect, useState } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useWorkspaceStore, workSpaceType } from "../../stores/workspaceStore";
import GenericEditingModal from "./GenericEditingModal";
import { useLocation, useNavigate } from "react-router-dom";
import { emptyWorkSpace } from "./WorkspaceSelector";
import queryString from "query-string";

const EditWorkspaceModal = () => {
  const [editedWorkSpaceName, setEditedWorkSpaceName] = useState("");
  const [workspace, setWorkspace] = useState<workSpaceType>(emptyWorkSpace);
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { editWorkSpaceName, workspaces } = useWorkspaceStore();
  const { editedWorkspaceId } = queryString.parse(useLocation().search);
  const navigate = useNavigate();

  useEffect(() => {
    const existedWorkspace = workspaces.find(
      (workspace) => workspace.id === editedWorkspaceId,
    );
    if (existedWorkspace) {
      setWorkspace(existedWorkspace);
      setEditedWorkSpaceName(existedWorkspace.name);
    }
  }, [editedWorkspaceId]);

  const handleModalClose = () => {
    navigate(-1);
  };

  const handleEditedProjectSave = () => {
    if (editedWorkSpaceName === "" || workspace.name === editedWorkSpaceName) {
      showSnackbar("Name cannot be empty or the same", "error");
      return;
    }

    setIsLoading(true);

    editWorkSpaceName(editedWorkSpaceName, workspace.id)
      .then(() => {
        handleModalClose(), showSnackbar("Project edited", "success");
      })
      .catch(() => showSnackbar("Error editing project", "error"))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {snackBar}
      <GenericEditingModal
        modalProps={{
          open: editedWorkspaceId ? true : false,
          onClose: handleModalClose,
        }}
        paperHeadLine="Edit Project"
        textFieldProps={{
          placeholder: workspace.name,
          label: "Current name: " + workspace.name,
          value: editedWorkSpaceName,
          onChange: (e) => setEditedWorkSpaceName(e.target.value),
        }}
        acceptButtonValue="Save"
        cancelButtonValue="Cancel"
        cancelButtonProps={{ onClick: handleModalClose }}
        acceptButtonProps={{
          onClick: handleEditedProjectSave,
          disabled: isLoading,
        }}
        isLoading={isLoading}
      />
    </>
  );
};

export default EditWorkspaceModal;
