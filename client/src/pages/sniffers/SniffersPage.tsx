import { useEffect, useState } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useAuthStore } from "../../stores/authStore";
import { useSniffersStore } from "../../stores/sniffersStores";
import { CreateInvocation, SnifferData } from "./SniffersPage/SnifferData";
import { SniffersSideBar } from "./SniffersSideBar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

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
    <PanelGroup direction={"horizontal"}>
      <div className="flex flex-row w-full h-[calc(100vh-96px)] max-h-[calc(vh-96px)]">
        {snackBar}
        <Panel defaultSize={20}>
          <div className="flex flex-col h-full min-w-[240px]  border-r border-border-color bg-secondary">
            <SniffersSideBar />
          </div>
        </Panel>
        <div className="relative w-[1px]  h-full  hover:bg-blue-300">
          <PanelResizeHandle
            className={`w-[30px] h-full absolute left-[-15px] top-0 `}
          />
        </div>
        <Panel>
          <div
            className={`flex bg-tertiary h-[calc(vh-96px)] max-h-[calc(100vh-96px)]`}
          >
            {children}
          </div>
        </Panel>
      </div>
    </PanelGroup>
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

export const SnifferPage = () => {
  return (
    <SnifferPageTemplate>
      <Sniffer />
    </SnifferPageTemplate>
  );
};

export default SnifferPageTemplate;
