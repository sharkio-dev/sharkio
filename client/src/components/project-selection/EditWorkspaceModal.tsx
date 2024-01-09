import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useWorkspaceStore, workSpaceType } from "../../stores/workspaceStore";
import GenericEditingModal from "./GenericEditingModal";
import { emptyWorkSpace } from "./WorkspaceSelector";
import { AiOutlinePlus } from "react-icons/ai";

const EditWorkspaceModal = () => {
  const [editedWorkSpaceName, setEditedWorkSpaceName] = useState("");
  const [workspace, setWorkspace] = useState<workSpaceType>(emptyWorkSpace);
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { editWorkSpaceName, workspaces, getWorkspaceUsers } =
    useWorkspaceStore();
  const { editedWorkspaceId } = queryString.parse(useLocation().search);
  const navigate = useNavigate();
  const [workspaceUsers, setWorkspaceUsers] = useState([]);

  useEffect(() => {
    const existedWorkspace = workspaces.find(
      (workspace) => workspace.id === editedWorkspaceId,
    );

    editedWorkspaceId != null &&
      typeof editedWorkspaceId === "string" &&
      getWorkspaceUsers(editedWorkspaceId).then((res) => {
        setWorkspaceUsers(res);
      });

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
        paperHeadLine="Edit Workspace"
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
      >
        <div className="pt-2">
          <div className="flex items-center gap-5">
            <Typography variant="body1">Members</Typography>
            <div className="flex items-center text-blue-500">
              <IconButton>
                <AiOutlinePlus className="text-xl text-blue-500 " />
              </IconButton>
              <Typography className="">Add</Typography>
            </div>
          </div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>name</TableCell>
                  <TableCell>action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  {workspaceUsers.map((user: any) => (
                    <>
                      <TableCell>{user.name}</TableCell>
                    </>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </GenericEditingModal>
    </>
  );
};

export default EditWorkspaceModal;
