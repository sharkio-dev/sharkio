import { useEffect, useState } from "react";
import { SniffersSideBar } from "./SniffersSideBar";
import { SnifferType, useSniffersStore } from "../../stores/sniffersStores";
import { useAuthStore } from "../../stores/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";
import { LoadingIcon } from "./LoadingIcon";
import { useNavigate, useParams } from "react-router-dom";
import { SnifferData } from "./SniffersPage/SnifferData";
import { LivePage } from "./SniffersPage/LivePage";
import { getEnpoints } from "../../api/api";
import { EndpointType } from "./types";

const SniffersPage = () => {
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadSniffers, sniffers } = useSniffersStore();

  const [loadingSniffers, setLoadingSniffers] = useState(false);

  const { snifferId, endpointId } = useParams();
  const userId = useAuthStore((s) => s.user?.id);

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

  return (
    <div className="flex flex-row w-full h-[calc(100vh-96px)] max-h-[calc(vh-96px)]">
      {snackBar}
      <div className="flex flex-col h-full min-w-[240px] w-[240px] border-r border-border-color bg-secondary">
        {loadingSniffers ? (
          <div className="flex h-full justify-center items-center">
            <LoadingIcon />
          </div>
        ) : (
          <SniffersSideBar />
        )}
      </div>
      <div
        className={`flex bg-tertiary h-[calc(vh-96px)] max-h-[calc(vh-96px)] w-full`}
      >
        {sniffer && endpointId && <SnifferData sniffer={sniffer} />}
        {!sniffer && !endpointId && <LivePage />}
      </div>
    </div>
  );
};

export default SniffersPage;
