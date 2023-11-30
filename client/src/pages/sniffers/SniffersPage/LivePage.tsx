import { useCallback, useEffect } from "react";
import { InvocationsBottomBar } from "../InvocationsBottomBar";
import { InvocationUpperBar } from ".././InvocationUpperBar";
import { useNavigate, useParams } from "react-router-dom";
import { useSniffersStore } from "../../../stores/sniffersStores";
import { useSnackbar } from "../../../hooks/useSnackbar";

export const LivePage = () => {
  const { invocationId } = useParams();
  const navigator = useNavigate();
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadLiveInvocations, invocations } = useSniffersStore();

  const invocation = invocations.find((i) => i.id === invocationId);

  const loadInvocations = async () => {
    return loadLiveInvocations().catch(() => {
      showSnackbar("Failed to get live invocations", "error");
    });
  };

  useEffect(() => {
    loadInvocations();
    const int = setInterval(() => {
      loadInvocations();
    }, 60000);

    return () => {
      clearInterval(int);
    };
  }, []);

  const onInvocationClick = useCallback(
    (id: string) => {
      navigator(`/live/invocations/${id}`);
    },
    [invocationId]
  );
  const bottomBarHeight = !invocationId
    ? "h-1/1 max-h-[calc(100vh-56px)]"
    : "h-1/3 max-h-[calc(33vh-16px)]";

  return (
    <>
      <div className={`flex flex-col w-full`}>
        {snackBar}
        {invocationId && (
          <div className="flex flex-col p-4 px-4 border-b border-border-color h-2/3 max-h-[calc(67vh-56px)]">
            <InvocationUpperBar
              activeInvocation={invocation}
              onExecuteRequest={() => loadInvocations()}
            />
          </div>
        )}
        <div className={`flex flex-col p-2 px-4 ${bottomBarHeight}`}>
          <InvocationsBottomBar
            title={"Live Invocations"}
            activeInvocation={invocation}
            setActiveInvocation={onInvocationClick}
            refresh={() => loadInvocations()}
          />
        </div>
      </div>
    </>
  );
};
