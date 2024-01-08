import { useCallback, useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../constants/routes";
import { InvocationUpperBar } from "./LiveInvocationUpperBar";
import { InvocationsSearchBar } from "./LiveInvocationsBottomBar";
import LiveInvocationsSideBar from "./live-invocations-side-bar/LiveInvocationsSideBar";
import { InvocationType } from "../sniffers/types";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useSniffersStore } from "../../stores/sniffersStores";
import { BackendAxios } from "../../api/backendAxios";
import InnerPageTemplate from "../../components/inner-page-template/inner-page-template";

export const LivePage = () => {
  const navigator = useNavigate();
  const [invocation, setInvocation] = useState<InvocationType>();
  const { invocationId } = useParams();

  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadLiveInvocations, invocations, loadingInvocations } =
    useSniffersStore();

  const loadInvocations = async () => {
    return loadLiveInvocations().catch(() => {
      showSnackbar("Failed to get live invocations", "error");
    });
  };

  useEffect(() => {
    if (!invocationId) {
      setInvocation(undefined);
      return;
    }
    BackendAxios.get(`/invocation/${invocationId}`).then((res) => {
      if (res) {
        setInvocation(res.data);
      }
    });
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

  return (
    <InnerPageTemplate
      sideBarComponent={LiveInvocationsSideBar}
      contentComponent={() => (
        <>
          {(invocations.length > 0 || loadingInvocations) && (
            <div className={`flex flex-col w-full h-full`}>
              {snackBar}
              <PanelGroup
                direction={"vertical"}
                className="h-full max-h-full max-w-full"
              >
                <Panel
                  minSize={20}
                  className={invocationId ? `max-h-[80%]` : "max-h-0"}
                >
                  {invocationId && (
                    <div className="flex flex-col p-4 px-4 border-b border-border-color h-full">
                      <InvocationUpperBar
                        invocation={invocation}
                        setEditedInvocation={function (): void {
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
                <Panel
                  minSize={20}
                  className={`flex flex-col p-2 px-4 ${
                    invocationId ? `max-h-[80%]` : "max-h-full"
                  }`}
                >
                  <InvocationsSearchBar
                    title={"Live Invocations"}
                    activeInvocation={invocation}
                    setActiveInvocation={onInvocationClick}
                    refresh={() => loadInvocations()}
                  />
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
        </>
      )}
    />

    // <div className="flex flex-row w-full h-[calc(100vh-96px)]">
    //   <div className="flex flex-col h-full min-w-[240px] w-[240px] border-r border-border-color bg-secondary">
    //     <LiveInvocationsSideBar />
    //   </div>

    // </div>
  );
};
