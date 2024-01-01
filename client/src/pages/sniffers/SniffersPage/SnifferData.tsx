import queryString from "query-string";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useSniffersStore } from "../../../stores/sniffersStores";
import { InvocationUpperBar } from "../InvocationUpperBar";
import { InvocationsBottomBar } from "../InvocationsBottomBar";
import { useEffect, useState } from "react";
import { EndpointType, InvocationType } from "../types";

export const SnifferData: React.FC = () => {
  const navigator = useNavigate();
  const { show: showSnackbar } = useSnackbar();
  const { endpointId, invocationId } = useParams();
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

  const bottomBarHeight = !invocationId
    ? "h-1/1 max-h-[calc(100vh-56px)]"
    : "h-1/3 max-h-[calc(33vh-16px)]";

  return (
    <>
      <div className={`flex flex-col w-full`}>
        <div className="flex flex-col p-4 px-4 border-b border-border-color h-2/3 max-h-[calc(67vh-56px)] overflow-y-auto">
          <InvocationUpperBar
            setEditedInvocation={setEditedInvocation}
            invocation={editedInvocation}
          />
        </div>
        <div
          className={`flex flex-col p-2 px-4 ${bottomBarHeight} w-full overflow-y-auto`}
        >
          {invocations && (
            <InvocationsBottomBar
              handleInvocationClicked={onInvocationClick}
              title={"Invocations"}
              refresh={() => endpointId && refreshInvocations(endpointId)}
            />
          )}
        </div>
      </div>
    </>
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
          activeInvocation={invocation}
          setEditedInvocation={(v) => {
            setInvocation(v);
          }}
          showResponseTab={false}
        />
      </div>
    </div>
  );
};
