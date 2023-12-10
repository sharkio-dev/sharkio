import { useEffect, useState } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useWorkspaceStore, workSpaceType } from "../../stores/workspaceStore";
import { openModal } from "./WorkspaceSelector";
import EditingModal from "./EditingModal";

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
    if (editedWorkSpaceName === "" || workSpace.name === editedWorkSpaceName) {
      showSnackbar("Name cannot be empty or the same", "error");
      return;
    }

    setIsLoading(true);
    console.log("edit");

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
      <EditingModal
        modalProps={{
          open: modalIsOpen === "edit",
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
