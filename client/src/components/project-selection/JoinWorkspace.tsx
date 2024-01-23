import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addWorkspaceUser,
  checkIsMember,
  getWorkspace,
} from "../../api/workspacesApi";
import { workSpaceType } from "../../stores/workspaceStore";
import { LoadingIcon } from "../../pages/sniffers/LoadingIcon";
import { Button } from "@mui/material";
import { useAuthStore } from "../../stores/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";

export const JoinWorkspace = () => {
  const { workspaceId } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(false);
  const [workspace, setWorkspace] = useState<workSpaceType | undefined>();
  const { user } = useAuthStore();
  const { component: snackbar, show: showSnackbar } = useSnackbar();

  useEffect(() => {
    if (!workspaceId || !user) return;
    setIsLoading(true);

    Promise.all([
      checkIsMember(workspaceId, user?.id).then((res) => {
        setIsMember(res.data);
      }),
      getWorkspace(workspaceId).then((res) => {
        setWorkspace(res.data);
      }),
    ]).finally(() => {
      setIsLoading(false);
    });
  }, [workspaceId]);

  const handleJoin = () => {
    if (!workspaceId || !user) return;

    setIsJoining(true);
    addWorkspaceUser(workspaceId, user?.id)
      .then(() => {
        showSnackbar("Joined workspace", "success");
      })
      .catch(() => {
        showSnackbar("Failed to join workspace", "error");
      })
      .finally(() => {
        setIsJoining(false);
      });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center pt-10">
      {snackbar}
      <div className="text-3xl mb-10">
        <h1>Join workspace</h1>
      </div>
      {isLoading ? (
        <LoadingIcon />
      ) : (
        <div className="flex flex-col items-center">
          {isMember ? (
            <span className="mb-5">
              You are already a member of {workspace?.name ?? ""}
            </span>
          ) : (
            <>
              <span className="mb-5">
                You were invited to join {workspace?.name ?? ""}
              </span>

              <Button variant="contained" onClick={handleJoin}>
                {isJoining ? <LoadingIcon /> : <>JOIN</>}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
