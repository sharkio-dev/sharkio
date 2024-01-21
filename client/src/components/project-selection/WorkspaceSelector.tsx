import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import queryString from "query-string";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useWorkspaceStore, workSpaceType } from "../../stores/workspaceStore";
import { DeleteWorkspaceModal } from "./DeleteWorkspaceModal";
import EditWorkspaceModal from "./EditWorkspaceModal";
import NewWorkspaceItem from "./NewWorkspaceItem";
import NewWorkspaceModal from "./NewWorkspaceModal";
import WorkspaceItem from "./WorkspaceItem";

export const emptyWorkSpace: workSpaceType = {
  id: "",
  name: "",
  userId: "",
};
const ISHIDDEN: boolean = false;
const WorkspaceSelector = () => {
  const { workspaces, openWorkspace, changeBetweenWorkSpaces, getWorkspaces } =
    useWorkspaceStore();
  const location = useLocation();
  const { user } = useAuthStore();
  const { workspaceId } = queryString.parse(location.search);

  const setWorkspaceIdQuery = (workspaceId: string) => {
    const params = new URLSearchParams(location.search);
    params.set("workspaceId", workspaceId);
    changeBetweenWorkSpaces(workspaceId);
    window.location.href = `${window.location.origin}/proxies?workspaceId=${workspaceId}`;
  };

  const handleChangeWorkspace = async (workSpaceId: string) => {
    setWorkspaceIdQuery(workSpaceId);
  };

  useEffect(() => {
    getWorkspaces().then(() => {
      if (workspaceId) {
        changeBetweenWorkSpaces(workspaceId as string);
      } else if (user) {
        changeBetweenWorkSpaces(user.id);
      }
    });
  }, []);

  return (
    <div>
      {!ISHIDDEN && user && (
        <>
          <FormControl fullWidth size="small">
            <InputLabel>workspaces</InputLabel>
            <Select
              className="w-fit min-w-[200px]"
              value={openWorkspace?.id ?? user.id}
              label="Workspace"
              renderValue={() => openWorkspace?.name || "Default"}
              onChange={(e) => handleChangeWorkspace(e.target.value as string)}
            >
              <NewWorkspaceItem />
              <Divider orientation="horizontal" className="w-full" />
              <MenuItem
                key={"default-workspace"}
                value={user.id}
                className="w-full min-w-fit"
                dense={true}
              >
                <WorkspaceItem
                  workspace={{
                    id: user.id,
                    name: "Personal",
                    userId: user.id,
                    createdAt: "",
                    updatedAt: "",
                  }}
                  isSelected={openWorkspace?.id == null}
                  isDefault={true}
                />
              </MenuItem>
              {workspaces.map((workspace: workSpaceType) => {
                return (
                  <MenuItem
                    key={workspace.id}
                    value={workspace.id}
                    className="w-full min-w-fit"
                    dense={true}
                  >
                    <WorkspaceItem
                      workspace={workspace}
                      isSelected={workspace.id === openWorkspace?.id}
                    />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <NewWorkspaceModal />
          <EditWorkspaceModal />
          <DeleteWorkspaceModal />
        </>
      )}
    </div>
  );
};

export default WorkspaceSelector;
