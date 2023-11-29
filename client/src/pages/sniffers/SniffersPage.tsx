import { useEffect } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useAuthStore } from "../../stores/authStore";
import { useSniffersStore } from "../../stores/sniffersStores";
import { LivePage } from "./SniffersPage/LivePage";
import { CreateInvocation, SnifferData } from "./SniffersPage/SnifferData";
import { SniffersSideBar } from "./SniffersSideBar";

import Sniffer from "./SniffersPage/Sniffer";

interface SnifferPageTemplateProps {
  children?: React.ReactNode;
}
const SnifferPageTemplate: React.FC<SnifferPageTemplateProps> = ({
  children,
}) => {
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadSniffers } = useSniffersStore();
  const userId = useAuthStore((s) => s.user?.id);

  useEffect(() => {
    if (!userId) return;
    loadSniffers(true).catch(() => {
      showSnackbar("Failed to get sniffers", "error");
    });
  }, [userId]);

  return (
    <div className="flex flex-row w-full h-[calc(100vh-96px)] max-h-[calc(vh-96px)]">
      {snackBar}
      <div className="flex flex-col h-full min-w-[240px] w-[240px] border-r border-border-color bg-secondary">
        <SniffersSideBar />
      </div>

      <div
        className={`flex bg-tertiary h-[calc(vh-96px)] max-h-[calc(100vh-96px)] w-[calc(100vw-56px-240px)]`}
      >
        {children}
      </div>
    </div>
  );
};

export const SnifferEndpointPage = () => {
  return (
    <SnifferPageTemplate>
      <SnifferData />
    </SnifferPageTemplate>
  );
};

export const CreateInvocationPage = () => {
  return (
    <SnifferPageTemplate>
      <CreateInvocation />
    </SnifferPageTemplate>
  );
};

export const LiveSnifferPage = () => {
  return (
    <SnifferPageTemplate>
      <LivePage />
    </SnifferPageTemplate>
  );
};

export const SnifferPage = () => {
  return (
    <SnifferPageTemplate>
      <Sniffer />
    </SnifferPageTemplate>
  );
};

export default SnifferPageTemplate;
