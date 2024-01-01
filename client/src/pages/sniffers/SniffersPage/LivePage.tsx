import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useNavigate, useParams } from "react-router-dom";
import { BackendAxios } from "../../../api/backendAxios";
import { routes } from "../../../constants/routes";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useSniffersStore } from "../../../stores/sniffersStores";
import { InvocationUpperBar } from ".././InvocationUpperBar";
import { InvocationsBottomBar } from "../InvocationsBottomBar";
import { InvocationType } from "../types";

export const LivePage = () => {
  const { invocationId } = useParams();
  const navigator = useNavigate();
  const [invocation, setInvocation] = useState<InvocationType>();

  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadLiveInvocations, invocations, loadingInvocations } =
    useSniffersStore();

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

    navigator(`${routes.LIVE_INVOCATIONS}/${invocationId}`);
  }, [invocationId]);

  return (
    <div className="flex flex-row w-full h-[calc(100vh-96px)] max-h-[calc(vh-96px)]">
      {(invocations.length > 0 || loadingInvocations) && (
        <div className={`flex flex-col w-full h-full`}>
          {snackBar}
          <PanelGroup direction={"vertical"} className="h-full">
            <Panel
              minSize={50}
              className={invocationId ? `max-h-full` : "max-h-0"}
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
            <Panel minSize={10}>
              <div
                className={`flex flex-col p-2 px-4 max-h-full overflow-y-auto`}
              >
                <InvocationsBottomBar
                  title={"Live Invocations"}
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
