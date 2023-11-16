import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInvocations, getEnpoints } from "../../../api/api";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { SnifferType } from "../../../stores/sniffersStores";
import { EndpointSideBar } from "../EndpointSideBar";
import { InvocationUpperBar } from "../InvocationUpperBar";
import { InvocationsBottomBar } from "../InvocationsBottomBar";
import { LoadingIcon } from "../LoadingIcon";
import { InvocationType, EndpointType } from "../types";

interface SnifferDataProps {
  sniffer: SnifferType;
}
export const SnifferData: React.FC<SnifferDataProps> = (props) => {
  const navigator = useNavigate();
  const { show: showSnackbar } = useSnackbar();
  const [invocations, setInvocations] = useState<InvocationType[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [endpoints, setEndpoints] = useState<EndpointType[]>([]);
  const { snifferId, endpointId, invocationId } = useParams();
  const [loadingEndpoints, setLoadingEndpoints] = useState(false);
  const sniffer = props.sniffer;
  const endpoint = endpoints.find((e) => e.id === endpointId);
  const invocation = invocations.find((i) => i.id === invocationId);

  // Invocations source function
  const refreshInvocations = (endpointId: string) => {
    setLoadingRequests(true);
    getInvocations(endpointId)
      .then((res) => {
        setInvocations(res.data);
        return res.data;
      })
      .then((invocations) => {
        if (invocations.length > 0) {
          navigator(
            `/sniffers/${snifferId}/endpoints/${endpointId}/invocations/${invocations[0].id}`,
            { replace: true }
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

  // Populate the endpoints of the screen
  useEffect(() => {
    if (!snifferId) return;
    setLoadingEndpoints(true);
    getEnpoints(snifferId)
      .then((res) => {
        setEndpoints(res.data);
        if (res.data.length > 0) {
          navigator(`/sniffers/${snifferId}/endpoints/${res.data[0].id}`, {
            replace: true,
          });
        }
      })
      .catch(() => {
        showSnackbar("Failed to get endpoints", "error");
      })
      .finally(() => {
        setLoadingEndpoints(false);
      });
  }, [snifferId]);

  const onEndpointClick = (endpointId: string) => {
    setInvocations([]);
    navigator(`/sniffers/${snifferId}/endpoints/${endpointId}`);
  };

  const onInvocationClick = (invocationId: string) => {
    navigator(
      `/sniffers/${snifferId}/endpoints/${endpointId}/invocations/${invocationId}`
    );
  };

  return (
    <>
      <div className={`flex flex-col w-[calc(100vw-296px-25%)]`}>
        <div className="flex flex-col p-4 px-4 border-b border-border-color h-2/3 max-h-[calc(67vh-56px)] overflow-y-auto">
          <InvocationUpperBar
            activeInvocation={invocation}
            activeSniffer={sniffer}
            onExecuteRequest={() =>
              endpointId && refreshInvocations(endpointId)
            }
          />
        </div>
        <div className="flex flex-col p-2 px-4 h-1/3 max-h-[calc(33vh-16px)] overflow-y-auto overflow-x-auto">
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
      <div className="flex flex-col h-full max-h-[calc(100vh-96px)] min-w-[25%] p-4 border-l border-border-color overflow-y-auto">
        {endpoints && loadingEndpoints ? (
          <div className="flex flex-1 justify-center items-center">
            <LoadingIcon />
          </div>
        ) : (
          <EndpointSideBar
            activeEndpoint={endpoint}
            setActiveEndpoint={onEndpointClick}
            endpoints={endpoints}
          />
        )}
      </div>
    </>
  );
};
