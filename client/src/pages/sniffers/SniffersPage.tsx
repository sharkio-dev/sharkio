import { useEffect, useState } from "react";
import { Requests } from "../requests/requests";
import { SniffersSideBar } from "./SniffersSideBar";
import { Sniffer, useSniffersStore } from "../../stores/sniffersStores";
import { useAuthStore } from "../../stores/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";

const SniffersPage = () => {
  const [activeSniffer, setActiveSniffer] = useState<Sniffer>();
  const { show: showSnackbar, component: snackBar } = useSnackbar();

  const { loadSniffers } = useSniffersStore();
  const { user } = useAuthStore();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    loadSniffers().catch(() => {
      showSnackbar("Failed to get sniffers", "error");
    });
  }, [userId]);

  return (
    <div className="flex flex-row h-full w-full">
      {snackBar}
      <SniffersSideBar
        activeSniffer={activeSniffer}
        setActiveSniffer={setActiveSniffer}
      />
      <div className="flex bg-[#232323] h-full w-full">
        <Requests />
      </div>
    </div>
  );
};

export default SniffersPage;
