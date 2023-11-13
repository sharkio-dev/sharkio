import { TestSuiteSideBar } from "./TestSuiteSideBar";
import { TestSuiteMainSection } from "./TestSuiteMainSection";
import { useParams } from "react-router-dom";

const TestSuitePage = () => {
  return (
    <div className={`flex h-full flex-row w-[calc(100vw-56px)]`}>
      <div className="flex flex-col h-full min-w-[20%] w-[20%] border-r border-border-color bg-secondary py-4">
        <TestSuiteSideBar />
      </div>

      <div className="flex flex-col w-[calc(100vw-56px-20%)] p-4 space-y-4">
        <TestSuiteMainSection />
      </div>
    </div>
  );
};

export default TestSuitePage;
