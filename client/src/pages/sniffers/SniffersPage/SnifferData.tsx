import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInvocations } from "../../../api/api";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { InvocationUpperBar } from "../InvocationUpperBar";
import { InvocationsBottomBar } from "../InvocationsBottomBar";
import { LoadingIcon } from "../LoadingIcon";
import { InvocationType } from "../types";

export const SnifferData: React.FC = () => {
  const navigator = useNavigate();
  const { show: showSnackbar } = useSnackbar();
  const [invocations, setInvocations] = useState<InvocationType[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const { snifferId, endpointId, invocationId } = useParams();
  const invocation = invocations?.find((i) => i.id === invocationId);

  // Invocations source function
  const refreshInvocations = (endpointId: string) => {
    setLoadingRequests(true);
    getInvocations(endpointId)
      .then((res) => {
        setInvocations(res || []);
        return res;
      })
      .then((invocations) => {
        if (invocations.length > 0) {
          navigator(
            `/sniffers/${snifferId}/endpoints/${endpointId}/invocations/${invocations[0].id}`,
            { replace: true },
          );
        }
      })
      .catch(() => {
        setInvocations([]);
        showSnackbar("Failed to get invocations", "error");
      })
      .finally(() => {
        setLoadingRequests(false);
      });
  };

  // populate the invocations
  useEffect(() => {
    if (!endpointId) {
      setInvocations([]);
    } else {
      refreshInvocations(endpointId);
    }
  }, [endpointId]);

  const onInvocationClick = (invocationId: string) => {
    navigator(
      `/sniffers/${snifferId}/endpoints/${endpointId}/invocations/${invocationId}`,
    );
  };

  return (
    <>
      <div className={`flex flex-col  w-full`}>
        <div className="flex flex-col p-4 px-4 border-b border-border-color h-2/3 max-h-[calc(67vh-56px)] overflow-y-auto">
          <InvocationUpperBar
            activeInvocation={invocation}
            onExecuteRequest={() =>
              endpointId && refreshInvocations(endpointId)
            }
          />
        </div>
        <div className="flex flex-col p-2 px-4 h-1/3 max-h-[calc(33vh-16px)] w-full overflow-y-auto overflow-x-auto">
          {invocations &&
            (loadingRequests ? (
              <div className="flex flex-1 justify-center items-center">
                <LoadingIcon />
              </div>
            ) : (
              <InvocationsBottomBar
                title={"Invocations"}
                invocations={invocations}
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
