import { useLocation, useParams } from "react-router-dom";
import queryString from "query-string";
import { MockSideBar } from "./MockSideBar";
import { MockMainSection } from "./MockMainSection";
import InnerPageTemplate from "../../components/inner-page-template/inner-page-template";

export const MockPage = () => {
  const { mockId } = useParams();
  const location = useLocation();
  const { isNew, snifferId } = queryString.parse(location.search);

  return (
    <InnerPageTemplate
      sideBarComponent={MockSideBar}
      contentComponent={() => (
        <>{snifferId && (mockId || isNew) && <MockMainSection />}</>
      )}
    />
  );
};
