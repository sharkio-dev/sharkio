import { useCallback, useEffect } from "react";
import { InvocationsSearchBar } from "./LiveInvocationsBottomBar";
import { InvocationUpperBar } from "./LiveInvocationUpperBar";
import { useNavigate, useParams } from "react-router-dom";
import { useSniffersStore } from "../../stores/sniffersStores";
import { useSnackbar } from "../../hooks/useSnackbar";
import { routes } from "../../constants/routes";
import LiveInvocationsSideBar from "./live-invocations-side-bar/LiveInvocationsSideBar";

export const LivePage = () => {
  const { invocationId } = useParams();
  const navigator = useNavigate();
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadLiveInvocations, invocations, loadingInvocations, loadSniffers } =
    useSniffersStore();

  //TODO add back button when click on invocation

  const invocation =
    (invocations &&
      Array.isArray(invocations) &&
      invocations.find((i) => i.id === invocationId)) ||
    undefined;

  const loadInvocations = async () => {
    return loadLiveInvocations().catch(() => {
      showSnackbar("Failed to get live invocations", "error");
    });
  };
  useEffect(() => {
    loadSniffers();
  }, [invocationId]);


  const onInvocationClick = useCallback(
    (id: string) => {
      const currentSearchParams = new URLSearchParams(window.location.search);
      navigator(
        `${routes.LIVE_INVOCATIONS}/${id}?${currentSearchParams.toString()}`,
      );
    },
    [invocationId],
  );
  const bottomBarHeight = !invocationId
    ? "h-1/1 max-h-[calc(100vh-56px)]"
    : "h-1/3 max-h-[calc(33vh-16px)]";

  return (
    <div className="flex flex-row w-full h-[calc(100vh-96px)] max-h-[calc(vh-96px)]">
      <div className="flex flex-col h-full min-w-[240px] w-[240px] border-r border-border-color bg-secondary">
        <LiveInvocationsSideBar />
      </div>
      {(invocations.length > 0 || loadingInvocations) && (
        <div className={`flex flex-col w-full`}>
          {snackBar}
          {invocationId && (
            <div className="flex flex-col p-4 px-4 border-b border-border-color h-2/3 max-h-[calc(67vh-56px)]">
              <InvocationUpperBar activeInvocation={invocation} />
            </div>
          )}
          <div className={`flex flex-col p-2 px-4 ${bottomBarHeight}`}>
            <InvocationsSearchBar
              title={"Live Invocations"}
              activeInvocation={invocation}
              setActiveInvocation={onInvocationClick}
              refresh={() => loadInvocations()}
            />
          </div>
        </div>
      )}
      {invocations.length === 0 && !loadingInvocations && (
        <div className="flex flex-col justify-center items-center h-full w-full">
          <div className="flex flex-col justify-center items-center space-y-4">
            <h1 className="text-2xl font-semibold ">No Live Requests</h1>
            <h2 className="text-lg font-medium ">
              <a href="/proxies/create" className="text-blue-400">
                Create
              </a>{" "}
              a new sniffer to start sniffing
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};
