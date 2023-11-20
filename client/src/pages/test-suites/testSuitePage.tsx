import { TestSuiteSideBar } from "./TestSuiteSideBar";
import { TestSuiteMainSection } from "./TestSuiteMainSection";

const TestSuitePage = () => {
  return (
    <div className={`flex h-full flex-row w-[calc(100vw-56px)]`}>
      <div className="flex flex-col h-full min-w-[240px] w-[240px] border-r border-border-color bg-secondary py-4">
        <TestSuiteSideBar />
      </div>

      <div className="flex flex-col max-h-[calc(100vh-96px)] w-[calc(100vw-56px-240px)] p-4 space-y-4 overflow-y-auto">
        <TestSuiteMainSection />
      </div>
    </div>
  );
};

export default TestSuitePage;
