import { useCallback, useEffect, useState } from "react";
import { SniffersSideBar } from "./SniffersSideBar";
import { SnifferType, useSniffersStore } from "../../stores/sniffersStores";
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
  const [invocations, setInvocations] = useState<InvocationType[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const { invocationId } = useParams();
  const navigator = useNavigate();

  const invocation = invocations.find((i) => i.id === invocationId);

  const loadInvocations = async () => {
    setLoadingRequests(true);
    return getLiveInvocations()
      .then((res) => {
        const invocations = res.data;
        setInvocations(invocations);
        if (invocations.length > 0 && !invocationId) {
          navigator(`/invocations/${invocations[0].id}`, {
            replace: true,
          });
        }
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

  const onInvocationClick = useCallback(
    (id: string) => {
      navigator(`/invocations/${id}`);
    },
    [invocationId],
  );

  return (
    <>
      <div className={`flex flex-col w-full`}>
        <div className="flex flex-col p-4 px-4 border-b border-border-color h-2/3 max-h-[calc(67vh-56px)] overflow-y-auto">
          <InvocationUpperBar
            activeInvocation={invocation}
            activeSniffer={undefined}
            refresh={() => loadInvocations()}
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
    </>
  );
};

const SniffersPage = () => {
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadSniffers, sniffers } = useSniffersStore();

  const [loadingSniffers, setLoadingSniffers] = useState(false);
  const { snifferId } = useParams();
  const userId = useAuthStore((s) => s.user?.id);
  const navigator = useNavigate();

  const sniffer = sniffers.find((s) => s.id === snifferId);

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

  const onSnifferClick = async (sniffer: SnifferType) => {
    if (snifferId === sniffer.id) {
      navigator(`/live`);
      return;
    }
    navigator(`/sniffers/${sniffer.id}`);
  };

  return (
    <div className="flex flex-row h-full w-[calc(100vh-56px)">
      {snackBar}
      <div className="flex flex-col h-full min-w-[240px] w-[240px] border-r border-border-color bg-secondary">
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
      <div className={`flex bg-tertiary h-full w-full`}>
        {snifferId ? <SnifferData /> : <LivePage />}
      </div>
    </div>
  );
};

const SnifferData = () => {
  const { show: showSnackbar } = useSnackbar();
  const [invocations, setInvocations] = useState<InvocationType[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [endpoints, setEndpoints] = useState<EndpointType[]>([]);
  const { snifferId, endpointId, invocationId } = useParams();
  const [loadingEndpoints, setLoadingEndpoints] = useState(false);
  const endpoint = endpoints.find((e) => e.id === endpointId);
  const invocation = invocations.find((i) => i.id === invocationId);
  const sniffer = useSniffersStore((s) =>
    s.sniffers.find((s) => s.id === snifferId),
  );
  const navigator = useNavigate();

  useEffect(() => {
    if (!endpointId) {
      setEndpoints([]);
      setInvocations([]);
      return;
    }
    refreshInvocations(endpointId);
  }, [endpointId]);

  const refreshInvocations = (invocationId?: string) => {
    if (!invocationId) {
      setInvocations([]);
      return;
    }
    setInvocations([]);
    setLoadingRequests(true);
    getInvocations(invocationId)
      .then((res) => {
        setInvocations(res);
        if (res.length > 0) {
          navigator(
            `/sniffers/${snifferId}/endpoints/${endpointId}/invocations/${res[0].id}`,
            { replace: true },
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

  useEffect(() => {
    if (!snifferId) return;
    setEndpoints([]);
    setLoadingEndpoints(true);
    getEnpoints(snifferId)
      .then((data) => {
        setEndpoints(data);
        if (data.length > 0) {
          navigator(`/sniffers/${snifferId}/endpoints/${data[0].id}`, {
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
      `/sniffers/${snifferId}/endpoints/${endpointId}/invocations/${invocationId}`,
    );
  };

  return (
    <>
      <div className={`flex flex-col w-[calc(100vw-296px-25%)]`}>
        <div className="flex flex-col p-4 px-4 border-b border-border-color h-2/3 max-h-[calc(67vh-56px)] overflow-y-auto">
          <InvocationUpperBar
            activeInvocation={invocation}
            activeSniffer={sniffer}
            refresh={() => refreshInvocations(endpointId)}
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
            endpoints={endpoints}
          />
        )}
      </div>
    </>
  );
};

export default SniffersPage;
