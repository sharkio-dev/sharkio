import queryString from "query-string";
import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useSniffersStore } from "../../../stores/sniffersStores";
import { InvocationUpperBar } from "../../live-Invocations/LiveInvocationUpperBar";
import { InvocationsSearchBar } from "../../live-Invocations/LiveInvocationsBottomBar";
import { EndpointType, InvocationType } from "../types";

export const SnifferData: React.FC = () => {
  const navigator = useNavigate();
  const { show: showSnackbar } = useSnackbar();
  const { endpointId } = useParams();
  const { endpoints, invocations, loadInvocations, resetInvocations } =
    useSniffersStore();
  const [editedInvocation, setEditedInvocation] = useState<
    EndpointType | undefined
  >(undefined);

  const location = useLocation();
  const { snifferId } = queryString.parse(location.search);

  useEffect(() => {
    const invocation = endpoints?.find((e) => e.id === endpointId);
    setEditedInvocation(invocation);
  }, [endpointId]);

  // Invocations source function
  const refreshInvocations = (endpointId: string) => {
    loadInvocations(endpointId, true).catch(() => {
      resetInvocations();
      showSnackbar("Failed to get invocations", "error");
    });
  };

  const onInvocationClick = (invocationId: string) => {
    const invocation = {
      ...(invocations?.find((i) => i.id === invocationId) ?? {
        ...defaultInvocation,
      }),
    };
    setEditedInvocation(invocation);
    navigator(
      `/endpoints/${endpointId}/invocations/${invocationId}?snifferId=${snifferId}`,
      { replace: true },
    );
  };

  return (
    <PanelGroup
      direction={"vertical"}
      className="min-h-[calc(100vh-128px)] max-h-[calc(100vh-10px)] overflow-hidden"
    >
      <Panel maxSize={80} defaultSize={50} className="w-full h-full">
        <div className="h-full flex flex-col p-4 px-4 border-b border-border-color overflow-y-auto">
          <InvocationUpperBar
            setEditedInvocation={setEditedInvocation}
            invocation={editedInvocation}
          />
        </div>
      </Panel>
      <div className="relative h-[1px] w-full hover:bg-blue-300">
        <PanelResizeHandle
          className={`h-[30px] w-full absolute top-[-15px] left-0 `}
        />
      </div>
      <Panel maxSize={80} defaultSize={50} className="w-full">
        <div className={`h-full flex flex-col w-full overflow-y-auto`}>
          {invocations && (
            <InvocationsSearchBar
              invocationId={editedInvocation?.id}
              title={"Invocations"}
              setActiveInvocation={onInvocationClick}
            />
          )}
        </div>
      </Panel>
    </PanelGroup>
  );
};

const defaultInvocation: InvocationType = {
  id: "",
  endpointId: "",
  method: "GET",
  headers: {},
  body: "",
  snifferId: "",
  url: "",
  response: {
    status: 200,
    body: "",
    headers: {},
  },
  createdAt: new Date().toISOString(),
};
export const CreateInvocation: React.FC = () => {
  const [invocation, setInvocation] = useState<EndpointType | undefined>(
    defaultInvocation,
  );
  return (
    <div className={`flex flex-col w-full`}>
      <div className="flex flex-col p-4 px-4 h-[100vh-96px] overflow-y-auto">
        <InvocationUpperBar
          isDisabled={false}
          invocation={invocation}
          setEditedInvocation={(v) => {
            setInvocation(v);
          }}
          showResponseTab={false}
        />
      </div>
    </div>
  );
};
