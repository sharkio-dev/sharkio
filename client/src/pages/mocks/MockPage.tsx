import { MockSideBar } from "./MockSideBar";
import { MockMainSection } from "./MockMainSection";
import InnerPageTemplate from "../../components/inner-page-template/inner-page-template";

export const MockPage = () => {
  return (
    <InnerPageTemplate
      sideBarComponent={MockSideBar}
      contentComponent={MockMainSection}
    />
  );
};
