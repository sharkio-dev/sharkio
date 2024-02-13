import InnerPageTemplate from "../../components/inner-page-template/inner-page-template";
import { FlowSideBar } from "./FlowSideBar";
import { FlowContent } from "./FlowContent";

export interface FlowStep {
  id: string;
  ownerId: string;
  flowId: string;
  proxyId: string;
  name: string;
  url: string;
  body: string;
  subdomain: string;
  headers: { [key: string]: string };
  assertions: any[];
  method: string;
  createdAt: string;
  updatedAt: string;
}

const FlowPage = () => {
  return (
    <InnerPageTemplate
      sideBarComponent={FlowSideBar}
      contentComponent={FlowContent}
    />
  );
};

export default FlowPage;
