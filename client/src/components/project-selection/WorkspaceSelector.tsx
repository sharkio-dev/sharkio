import { useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
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
const ISHIDDEN: boolean = true;
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
      {ISHIDDEN && (
        <>
          <FormControl fullWidth size="small">
            <InputLabel>workspaces</InputLabel>
            <Select
              style={{ width: "200px" }}
              value={openWorkspace?.id || ""}
              label="Workspace"
              onChange={(e) => handleChangeWorkspace(e.target.value as string)}
            >
              <NewWorkspaceItem />
              {workspaces.map((workspace: workSpaceType) => {
                return (
                  <MenuItem key={workspace.id} value={workspace.id}>
                    <WorkspaceItem workspace={workspace} />
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
