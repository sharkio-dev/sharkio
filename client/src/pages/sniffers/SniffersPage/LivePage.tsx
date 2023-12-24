import { SetStateAction, useCallback, useEffect } from "react";
import { InvocationsBottomBar } from "../InvocationsBottomBar";
import { InvocationUpperBar } from ".././InvocationUpperBar";
import { useNavigate, useParams } from "react-router-dom";
import { useSniffersStore } from "../../../stores/sniffersStores";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { routes } from "../../../constants/routes";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { EndpointType } from "../types";

export const LivePage = () => {
  const { invocationId } = useParams();
  const navigator = useNavigate();
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadLiveInvocations, invocations, loadingInvocations } =
    useSniffersStore();

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
      navigator(`${routes.LIVE_INVOCATIONS}/${id}`);
    },
    [invocationId],
  );

  return (
    <div className="flex flex-row w-full h-[calc(100vh-96px)] max-h-[calc(vh-96px)]">
      {(invocations.length > 0 || loadingInvocations) && (
        <div className={`flex flex-col w-full h-full`}>
          {snackBar}
          <PanelGroup direction={"vertical"}>
            <Panel
              minSize={50}
              className={invocationId ? `max-h-full` : "max-h-0"}
            >
              {invocationId && (
                <div className="flex flex-col p-4 px-4 border-b border-border-color h-full">
                  <InvocationUpperBar
                    activeInvocation={invocation}
                    setEditedInvocation={function (
                      value: SetStateAction<EndpointType | undefined>,
                    ): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                </div>
              )}
            </Panel>

            <div className="relative h-[1px]  w-full  hover:bg-blue-300">
              <PanelResizeHandle
                className={`h-[30px] w-full absolute top-[-15px] left-0 `}
              />
            </div>
            <Panel minSize={10}>
              <div
                className={`flex flex-col p-2 px-4 max-h-full overflow-y-auto`}
              >
                <InvocationsBottomBar
                  title={"Live Invocations"}
                  activeInvocation={invocation}
                  setActiveInvocation={onInvocationClick}
                  refresh={() => loadInvocations()}
                />
              </div>
            </Panel>
          </PanelGroup>
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
