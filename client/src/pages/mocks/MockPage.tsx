import { useLocation, useParams } from "react-router-dom";
import queryString from "query-string";
import { MockSideBar } from "./MockSideBar";
import { MockMainSection } from "./MockMainSection";

export const MockPage = () => {
  const { mockId } = useParams();
  const location = useLocation();
  const { isNew, snifferId } = queryString.parse(location.search);

  return (
    <div className={`flex h-full flex-row w-[calc(100vw-56px)]`}>
      <div className="flex flex-col h-full min-w-[240px] w-[240px] border-r border-border-color bg-secondary">
        <MockSideBar />
      </div>

      <div className="flex flex-col max-h-[calc(100vh-96px)] w-[calc(100vw-56px-240px)] p-4 space-y-4 overflow-y-auto">
        {snifferId && (mockId || isNew) && <MockMainSection />}
      </div>
    </div>
  );
};
