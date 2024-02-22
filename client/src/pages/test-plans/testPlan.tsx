import InnerPageTemplate from "../../components/inner-page-template/inner-page-template";
import { TestPlansSideBar } from "./TestPlansSideBar";

const TestPlans = () => {
  return (
    <InnerPageTemplate
      sideBarComponent={TestPlansSideBar}
      contentComponent={() => <></>}
    />
  );
};

export default TestPlans;
