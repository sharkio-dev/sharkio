import { useCallback, useEffect, useState } from "react";
import { SniffersSideBar } from "./SniffersSideBar";
import { Sniffer, useSniffersStore } from "../../stores/sniffersStores";
import { useAuthStore } from "../../stores/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";
import { EndpointType, InvocationType } from "./types";
import { EndpointSideBar } from "./EndpointSideBar";
import { InvocationsBottomBar } from "./InvocationsBottomBar";
import { LoadingIcon } from "./LoadingIcon";
import { getEnpoints, getInvocations, getLiveInvocations } from "../../api/api";
import { InvocationUpperBar } from "./InvocationUpperBar";
import { useNavigate, useParams } from "react-router-dom";

export const LivePage = () => {
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadSniffers } = useSniffersStore();
  const { user } = useAuthStore();
  const [invocations, setInvocations] = useState<InvocationType[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingSniffers, setLoadingSniffers] = useState(false);
  const userId = user?.id;
  const { invocationId } = useParams();
  const navigator = useNavigate();

  const invocation = invocations.find((i) => i.id === invocationId);

  const loadInvocations = async () => {
    setLoadingRequests(true);
    return getLiveInvocations()
      .then((res) => {
        const invocations = res.data;
        setInvocations(invocations);
        return invocations;
      })
      .finally(() => {
        setLoadingRequests(false);
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
    if (!userId) return;
    setLoadingSniffers(true);
    loadSniffers()
      .catch(() => {
        showSnackbar("Failed to get sniffers", "error");
      })
      .finally(() => {
        setLoadingSniffers(false);
      });
  }, [userId]);

  const onSnifferClick = async (sniffer: Sniffer) => {
    navigator(`/sniffers/${sniffer.id}`);
  };

  const onInvocationClick = useCallback(
    (id: string) => {
      if (invocationId === id) {
        navigator(`/live`);
        return;
      }
      navigator(`/live/invocations/${id}`);
    },
    [invocationId]
  );

  return (
    <div className="flex flex-row h-full w-full">
      {snackBar}
      <div className="relative min-w-[240px] border-r-[0.1px] border-border-color bg-secondary">
        {loadingSniffers ? (
          <div className="flex h-full justify-center items-center">
            <LoadingIcon />
          </div>
        ) : (
          <SniffersSideBar
            activeSniffer={undefined}
            setActiveSniffer={onSnifferClick}
          />
        )}
      </div>
      <div className={`flex bg-tertiary h-full w-full`}>
        <div className={`flex flex-col w-full`}>
          <div className="flex flex-col p-4 px-4 border-b border-border-color h-2/3 max-h-[calc(67vh-56px)] overflow-y-auto">
            <InvocationUpperBar
              activeInvocation={invocation}
              activeSniffer={undefined}
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
                  title={"Live Invocations"}
                  invocations={invocations}
                  activeInvocation={invocation}
                  setActiveInvocation={onInvocationClick}
                  refresh={() => loadInvocations()}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SniffersPage = () => {
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadSniffers, sniffers } = useSniffersStore();
  const [invocations, setInvocations] = useState<InvocationType[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingSniffers, setLoadingSniffers] = useState(false);
  const [loadingEndpoints, setLoadingEndpoints] = useState(false);
  const [endpoints, setEndpoints] = useState<EndpointType[]>([]);
  const { snifferId, endpointId, invocationId } = useParams();
  const userId = useAuthStore((s) => s.user?.id);
  const navigator = useNavigate();

  const sniffer = sniffers.find((s) => s.id === snifferId);
  const endpoint = endpoints.find((e) => e.id === endpointId);
  const invocation = invocations.find((i) => i.id === invocationId);

  useEffect(() => {
    if (!userId) return;
    setLoadingSniffers(true);
    loadSniffers()
      .catch(() => {
        showSnackbar("Failed to get sniffers", "error");
      })
      .finally(() => {
        setLoadingSniffers(false);
      });
  }, [userId]);

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

  useEffect(() => {
    if (!endpointId) return;
    refreshInvocations(endpointId);
  }, [endpointId]);

  const refreshInvocations = (invocationId?: string) => {
    if (!invocationId) return;

    setLoadingRequests(true);
    getInvocations(invocationId)
      .then((res) => {
        setInvocations(res.data);
        if (res.data.length > 0) {
          navigator(
            `/sniffers/${snifferId}/endpoints/${endpointId}/invocations/${res.data[0].id}`,
            { replace: true }
          );
        }
      })
      .catch(() => {
        showSnackbar("Failed to get invocations", "error");
      })
      .finally(() => {
        setLoadingRequests(false);
      });
  };

  const onSnifferClick = async (sniffer: Sniffer) => {
    setEndpoints([]);
    setInvocations([]);
    navigator(`/sniffers/${sniffer.id}`);
  };

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
    <div className="flex flex-row h-full w-full">
      {snackBar}
      <div className="relative min-w-[240px] border-r-[0.1px] border-border-color bg-secondary">
        {loadingSniffers ? (
          <div className="flex h-full justify-center items-center">
            <LoadingIcon />
          </div>
        ) : (
          <SniffersSideBar
            activeSniffer={sniffer}
            setActiveSniffer={onSnifferClick}
          />
        )}
      </div>
      <div className={`flex bg-tertiary h-full w-[calc(100vw-296px)]`}>
        <div className={`flex flex-col w-[calc(100vw-296px-25%)]`}>
          <div className="flex flex-col p-4 px-4 border-b border-border-color h-2/3 max-h-[calc(67vh-56px)] overflow-y-auto">
            <InvocationUpperBar
              activeInvocation={invocation}
              activeSniffer={sniffer}
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
                  refresh={() => refreshInvocations(endpointId)}
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
              requests={endpoints}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SniffersPage;
