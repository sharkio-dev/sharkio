import { useEffect, useState } from "react";
import { SniffersSideBar } from "./SniffersSideBar";
import { Sniffer, useSniffersStore } from "../../stores/sniffersStores";
import { useAuthStore } from "../../stores/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";
import { LoadingIcon } from "./LoadingIcon";
import { useNavigate, useParams } from "react-router-dom";
import { SnifferData } from "./SniffersPage/SnifferData";
import { LivePage } from "./SniffersPage/LivePage";

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

  const onSnifferClick = async (sniffer: Sniffer) => {
    if (snifferId === sniffer.id) {
      navigator(`/live`);
      return;
    }
    navigator(`/sniffers/${sniffer.id}`);
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
      <div className={`flex bg-tertiary h-full w-full`}>
        {sniffer ? <SnifferData sniffer={sniffer} /> : <LivePage />}
      </div>
    </div>
  );
};

export default SniffersPage;
