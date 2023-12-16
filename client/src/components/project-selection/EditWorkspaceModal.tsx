import { useEffect, useState } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useWorkspaceStore, workSpaceType } from "../../stores/workspaceStore";
import GenericEditingModal from "./GenericEditingModal";

interface EditWorkspaceModalProps {
  isModalOpen: boolean;
  onCancel: () => void;
  workSpace: workSpaceType;
}

const EditWorkspaceModal: React.FC<EditWorkspaceModalProps> = ({
  isModalOpen,
  onCancel,
  workSpace,
}) => {
  const [editedWorkSpaceName, setEditedWorkSpaceName] = useState("");
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { editWorkSpaceName } = useWorkspaceStore();
  const handleEditedProjectSave = () => {
    if (editedWorkSpaceName === "" || workSpace.name === editedWorkSpaceName) {
      showSnackbar("Name cannot be empty or the same", "error");
      return;
    }

    setIsLoading(true);

    editWorkSpaceName(editedWorkSpaceName, workSpace.id)
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
      <GenericEditingModal
        modalProps={{
          open: isModalOpen,
          onClose: onCancel,
        }}
        paperHeadLine="Edit Project"
        textFieldProps={{
          placeholder: workSpace.name,
          label: "Current name: " + workSpace.name,
          value: editedWorkSpaceName,
          onChange: (e) => setEditedWorkSpaceName(e.target.value),
        }}
        acceptButtonValue="Save"
        cancelButtonValue="Cancel"
        cancelButtonProps={{ onClick: onCancel }}
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
