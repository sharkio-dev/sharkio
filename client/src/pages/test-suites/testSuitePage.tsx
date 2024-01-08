import InnerPageTemplate from "../../components/inner-page-template/inner-page-template";
import { TestSuiteMainSection } from "./TestSuiteMainSection";
import { TestSuiteSideBar } from "./TestSuiteSideBar";

const TestSuitePage = () => {
  return (
    <InnerPageTemplate
      sideBarComponent={TestSuiteSideBar}
      contentComponent={TestSuiteMainSection}
    />
  );
};

export default TestSuitePage;
