import { useEffect } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useAuthStore } from "../../stores/authStore";
import { useSniffersStore } from "../../stores/sniffersStores";
import { CreateInvocation, SnifferData } from "./SniffersPage/SnifferData";
import { SniffersSideBar } from "./SniffersSideBar";

import InnerPageTemplate from "../../components/inner-page-template/inner-page-template";
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
      showSnackbar("Failed to get proxies", "error");
    });
  }, [userId]);

  return (
    <div className="h-full">
      {snackBar}
      {children}
    </div>
  );
};

export const SnifferEndpointPage = () => {
  return (
    <SnifferPageTemplate>
      <InnerPageTemplate
        contentComponent={SnifferData}
        sideBarComponent={SniffersSideBar}
      />
    </SnifferPageTemplate>
  );
};

export const CreateInvocationPage = () => {
  return (
    <SnifferPageTemplate>
      <InnerPageTemplate
        contentComponent={CreateInvocation}
        sideBarComponent={SniffersSideBar}
      />
    </SnifferPageTemplate>
  );
};

export const SnifferPage = () => {
  return (
    <SnifferPageTemplate>
      <InnerPageTemplate
        contentComponent={Sniffer}
        sideBarComponent={SniffersSideBar}
      />
    </SnifferPageTemplate>
  );
};

export default SnifferPageTemplate;
