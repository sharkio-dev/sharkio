import { useEffect, useState } from "react";
import { SniffersSideBar } from "./SniffersSideBar";
import { Sniffer, useSniffersStore } from "../../stores/sniffersStores";
import { useAuthStore } from "../../stores/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";
import { EndpointType, InvocationType } from "./types";
import { EndpointSideBar } from "./EndpointSideBar";
import { InvocationsBottomBar } from "./InvocationsBottomBar";
import { LoadingIcon } from "./LoadingIcon";
import { getEnpoints, getInvocations, getRequests } from "../../api/api";
import { InvocationUpperBar } from "./InvocationUpperBar";
import { useNavigate, useParams } from "react-router-dom";

const SniffersPage = () => {
  const [activeSniffer, setActiveSniffer] = useState<string>();
  const [activeEndpoint, setActiveEndpoint] = useState<string>();
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadSniffers, sniffers } = useSniffersStore();
  const { user } = useAuthStore();
  const [invocations, setInvocations] = useState<InvocationType[]>([]);
  const [activeInvocation, setActiveInvocation] = useState<string>();
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingSniffers, setLoadingSniffers] = useState(false);
  const [loadingEndpoints, setLoadingEndpoints] = useState(false);
  const [endpoints, setEndpoints] = useState<EndpointType[]>([]);
  const [intervalInvocations, setIntervalInvocations] =
    useState<NodeJS.Timeout>();
  const userId = user?.id;
  const { snifferId, endpointId, invocationId } = useParams();
  const navigator = useNavigate();

  const sniffer = sniffers.find((s) => s.id === activeSniffer);
  const endpoint = endpoints.find((e) => e.id === activeEndpoint);
  const invocation = invocations.find((i) => i.id === activeInvocation);

  useEffect(() => {
    if (!snifferId) {
      setActiveSniffer(undefined);
      return;
    }
    setActiveSniffer(snifferId);
  }, [snifferId]);

  useEffect(() => {
    if (!endpointId) {
      setActiveEndpoint(undefined);
      return;
    }
    setActiveEndpoint(endpointId);
  }, [endpointId]);

  useEffect(() => {
    if (!invocationId) {
      setActiveInvocation(undefined);
      return;
    }

    setActiveInvocation(invocationId);
  }, [invocationId]);

  useEffect(() => {
    if (!activeSniffer) {
      const loadInvocations = () => {
        setLoadingRequests(true);
        getRequests()
          .then((res) => {
            setInvocations(res.data);
          })
          .finally(() => {
            setLoadingRequests(false);
          });
      };
      loadInvocations();
      const int = setInterval(() => {
        loadInvocations();
      }, 60000);

      setIntervalInvocations(int);
      return () => {
        clearInterval(int);
      };
    }
    clearInterval(intervalInvocations);
    setIntervalInvocations(undefined);
    setLoadingEndpoints(true);
    getEnpoints(activeSniffer)
      .then((res) => {
        setEndpoints(res.data);
      })
      .catch((err) => {
        showSnackbar("Failed to get endpoints", "error");
      })
      .finally(() => {
        setLoadingEndpoints(false);
      });
  }, [activeSniffer]);

  useEffect(() => {
    if (!activeEndpoint) return;
    setLoadingRequests(true);
    getInvocations(activeEndpoint)
      .then((res) => {
        setInvocations(res.data);
      })
      .catch((err) => {
        showSnackbar("Failed to get invocations", "error");
      })
      .finally(() => {
        setLoadingRequests(false);
      });
  }, [activeEndpoint]);

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

  const onSnifferClick = (sniffer: Sniffer) => {
    if (activeSniffer === sniffer.id) {
      setActiveSniffer(undefined);
      return;
    } else {
      setActiveSniffer(sniffer.id);
    }
    navigator(`/sniffers/${sniffer.id}`);
  };

  const onEndpointClick = (endpointId: string) => {
    if (activeEndpoint === endpointId) {
      setActiveEndpoint(undefined);
      return;
    }

    navigator(`/sniffers/${activeSniffer}/endpoints/${endpointId}`);
  };

  const onInvocationClick = (invocationId: string) => {
    if (activeInvocation === invocationId) {
      setActiveInvocation(undefined);
      return;
    }
    if (!activeEndpoint || !activeSniffer) {
      setActiveInvocation(invocationId);
      navigator(`/invocations/${invocationId}`);
      return;
    }
    navigator(
      `/sniffers/${activeSniffer}/endpoints/${activeEndpoint}/invocations/${invocationId}`
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
      <div
        className={`flex bg-tertiary h-full ${
          activeSniffer ? "w-[calc(100vw-296px)]" : "w-full"
        }`}
      >
        <div
          className={`flex flex-col ${
            activeSniffer ? "w-[calc(100vw-296px-25%)]" : "w-full"
          }`}
        >
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
                  title={activeSniffer ? "Invocations" : "🔴 Live Invocations"}
                  invocations={invocations}
                  activeInvocation={invocation}
                  setActiveInvocation={onInvocationClick}
                />
              ))}
          </div>
        </div>
        {activeSniffer && (
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
        )}
      </div>
    </div>
  );
};

export default SniffersPage;
