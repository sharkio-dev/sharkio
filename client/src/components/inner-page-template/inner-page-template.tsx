import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
interface innerPageTemplateProps {
  sideBarComponent: React.FC;
  contentComponent: React.FC;
}
export const InnerPageTemplate: React.FC<innerPageTemplateProps> = ({
  sideBarComponent: SideBarComponent,
  contentComponent: ContentComponent,
}) => {
  return (
    <div className={`flex h-full flex-row w-[calc(100vw-56px)]`}>
      <PanelGroup direction={"horizontal"}>
        <Panel defaultSize={20} minSize={15}>
          <div className="flex flex-col h-full border-r border-border-color bg-secondary py-4">
            <SideBarComponent />
          </div>
        </Panel>
        <div className="relative w-[1px]  h-full  hover:bg-blue-300">
          <PanelResizeHandle
            className={`w-[30px] h-full absolute left-[-15px] top-0 `}
          />
        </div>
        <Panel>
          <div className="flex flex-col max-h-[calc(100vh-96px)]  p-4 space-y-4 overflow-y-auto">
            <ContentComponent />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default InnerPageTemplate;
