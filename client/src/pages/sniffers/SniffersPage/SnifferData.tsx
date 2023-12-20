import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { InvocationUpperBar } from "../InvocationUpperBar";
import { InvocationsBottomBar } from "../InvocationsBottomBar";
import { LoadingIcon } from "../LoadingIcon";
import { useSniffersStore } from "../../../stores/sniffersStores";
import queryString from "query-string";

export const SnifferData: React.FC = () => {
  const navigator = useNavigate();
  const { show: showSnackbar } = useSnackbar();
  const { endpointId, invocationId } = useParams();
  const { invocations, loadingInvocations, loadInvocations, resetInvocations } =
    useSniffersStore();
  const invocation = invocations?.find((i) => i.id === invocationId);
  const location = useLocation();
  const { snifferId } = queryString.parse(location.search);

  // Invocations source function
  const refreshInvocations = (endpointId: string) => {
    loadInvocations(endpointId, true).catch(() => {
      resetInvocations();
      showSnackbar("Failed to get invocations", "error");
    });
  };

  const onInvocationClick = (invocationId: string) => {
    navigator(
      `/endpoints/${endpointId}/invocations/${invocationId}?snifferId=${snifferId}`,
    );
  };
  const bottomBarHeight = !invocationId
    ? "h-1/1 max-h-[calc(100vh-56px)]"
    : "h-1/3 max-h-[calc(33vh-16px)]";

  return (
    <>
      <div className={`flex flex-col  w-full`}>
        <div className="flex flex-col p-4 px-4 border-b border-border-color h-2/3 max-h-[calc(67vh-56px)] overflow-y-auto">
          <InvocationUpperBar activeInvocation={invocation} />
        </div>
        <div
          className={`flex flex-col p-2 px-4 ${bottomBarHeight} w-full overflow-y-auto`}
        >
          {invocations &&
            (loadingInvocations ? (
              <div className="flex h-[100vh] justify-center items-center">
                <LoadingIcon />
              </div>
            ) : (
              <InvocationsBottomBar
                title={"Invocations"}
                activeInvocation={invocation}
                setActiveInvocation={onInvocationClick}
                refresh={() => endpointId && refreshInvocations(endpointId)}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export const CreateInvocation: React.FC = () => {
  return (
    <div className={`flex flex-col w-full`}>
      <div className="flex flex-col p-4 px-4 h-[100vh-96px] overflow-y-auto">
        <InvocationUpperBar />
      </div>
    </div>
  );
};
