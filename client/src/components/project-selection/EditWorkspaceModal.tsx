import { Person } from "@mui/icons-material";
import {
  Button,
  IconButton,
  List,
  ListItemButton,
  TextField,
  Typography,
} from "@mui/material";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { removeUserFromWorkspace } from "../../api/workspacesApi";
import { useSnackbar } from "../../hooks/useSnackbar";
import { LoadingIcon } from "../../pages/sniffers/LoadingIcon";
import { useWorkspaceStore, workSpaceType } from "../../stores/workspaceStore";
import GenericEditingModal from "./GenericEditingModal";
import { emptyWorkSpace } from "./WorkspaceSelector";

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
  const joinUrl = `${window.location.origin}/join/${workspace.id}`;

  useEffect(() => {
    if (!workspace) return;
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
  }, [editedWorkspaceId, workspaces]);

  const handleModalClose = () => {
    navigate(window.location.pathname);
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
        acceptButtonValue="Save"
        cancelButtonValue="Cancel"
        cancelButtonProps={{ onClick: handleModalClose }}
        acceptButtonProps={{
          onClick: handleEditedProjectSave,
          disabled: isLoading,
        }}
        isLoading={isLoading}
      >
        <div className="flex flex-col gap-5 pt-2">
          <div className="flex flex-col items-center gap-5">
            <div className="w-full">
              <Typography variant="body1">Name</Typography>
            </div>
            <TextField
              className="w-full"
              inputProps={{ maxLength: 25 }}
              placeholder={workspace.name}
              label={"Current name: " + workspace.name}
              value={editedWorkSpaceName}
              onChange={(e) => setEditedWorkSpaceName(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center gap-5">
            <div className="w-full flex gap-3">
              <Typography variant="body1">Invite Member</Typography>
            </div>
            <div className="flex bg-black relative min-w-full gap-1 cursor-pointer ">
              <TextField
                contentEditable={false}
                focused={false}
                disabled={true}
                className="w-full absolute left-0 text-white cursor-help"
                value={joinUrl}
              />
              <Button
                variant="contained"
                onClick={() => {
                  navigator.clipboard.writeText(joinUrl);
                  showSnackbar("Url copied to clipboard", "success");
                }}
              >
                Copy
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 max-h-[200px]">
            <div className="w-full flex gap-3">
              <Typography variant="body1">Members</Typography>
            </div>
            <List className="w-full">
              {workspace != null &&
                workspaceUsers
                  .sort((user: any) => (user.id === workspace.userId ? -1 : 1))
                  .map((workspaceUser: any) => {
                    return (
                      <WorkspaceUserRow
                        workspace={workspace}
                        workspaceUser={workspaceUser}
                        isAdmin={workspaceUser.id === workspace.userId}
                        onDelete={() =>
                          setWorkspaceUsers((prev) =>
                            prev.filter(
                              (user: any) => user.id !== workspaceUser.id,
                            ),
                          )
                        }
                      />
                    );
                  })}
            </List>
          </div>
        </div>
      </GenericEditingModal>
    </>
  );
};
const WorkspaceUserRow: React.FC<{
  workspace: any;
  workspaceUser: any;
  isAdmin: boolean;
  onDelete?: () => void;
}> = ({ workspace, workspaceUser, isAdmin, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleRemoveMember = () => {
    setIsDeleting(true);
    removeUserFromWorkspace(workspace.id, workspaceUser.id)
      .then(() => {
        onDelete?.();
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <ListItemButton disableRipple className="gap-3 items-start">
      <Person className="text-gray-700"></Person>
      <div className="w-full flex gap-5">
        <Typography className="max-w-[30ch] truncate">
          {workspaceUser?.fullName}
        </Typography>
        <Typography>{workspaceUser?.email}</Typography>
        <Typography>{isAdmin && "Admin"}</Typography>
      </div>
      <div>
        <IconButton disabled={isAdmin} onClick={handleRemoveMember}>
          {isDeleting ? (
            <LoadingIcon />
          ) : (
            <AiOutlineDelete
              className={` text-lg cursor-pointer rounded-md active:scale-110 h-4 w-4 hover:bg-border-color ${
                !isAdmin && "text-red-400"
              }`}
              onClick={() => {}}
            />
          )}
        </IconButton>
      </div>
    </ListItemButton>
  );
};
export default EditWorkspaceModal;
