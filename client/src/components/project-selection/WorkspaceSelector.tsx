import { useEffect } from "react";
import {
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import WorkspaceItem from "./WorkspaceItem";
import NewWorkspaceModal from "./NewWorkspaceModal";
import EditWorkspaceModal from "./EditWorkspaceModal";
import NewWorkspaceItem from "./NewWorkspaceItem";
import { DeleteWorkspaceModal } from "./DeleteWorkspaceModal";
import { useWorkspaceStore, workSpaceType } from "../../stores/workspaceStore";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";

export const emptyWorkSpace: workSpaceType = {
  id: "",
  name: "",
};
const ISHIDDEN: boolean = false;
const WorkspaceSelector = () => {
  const { workspaces, openWorkspace, changeBetweenWorkSpaces, getWorkspaces } =
    useWorkspaceStore();
  const location = useLocation();
  const navigate = useNavigate();

  const { workspaceId } = queryString.parse(location.search);

  const setWorkspaceIdQuery = (workspaceId: string) => {
    const params = new URLSearchParams(location.search);
    params.set("workspaceId", workspaceId);
    navigate({ search: params.toString() }, { replace: true });
    changeBetweenWorkSpaces(workspaceId);
  };

  useEffect(() => {
    getWorkspaces().then((workspaces) => {
      if (workspaces.length > 0 && !workspaceId) {
        setWorkspaceIdQuery(workspaces[0].id);
      }
      if (workspaceId) {
        changeBetweenWorkSpaces(workspaceId as string);
      }
    });
  }, []);

  useEffect(() => {
    if (!workspaceId && openWorkspace) {
      setWorkspaceIdQuery(openWorkspace.id);
    }
  }, [workspaceId, openWorkspace, location.search]);

  const handleChangeWorkspace = async (workSpaceId: string) => {
    setWorkspaceIdQuery(workSpaceId);
  };

  return (
    <div>
      {!ISHIDDEN && (
        <>
          <FormControl fullWidth size="small">
            <InputLabel>workspaces</InputLabel>
            <Select
              className="w-fit min-w-[200px]"
              value={openWorkspace?.id ?? "1"}
              label="Workspace"
              renderValue={() => openWorkspace?.name || "Default"}
              onChange={(e) => handleChangeWorkspace(e.target.value as string)}
            >
              <NewWorkspaceItem />
              <Divider orientation="horizontal" className="w-full" />
              <MenuItem
                key={"default-workspace"}
                value={"default"}
                className="w-full min-w-fit"
                dense={true}
              >
                <WorkspaceItem
                  workspace={{
                    id: "default",
                    name: "default",
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
