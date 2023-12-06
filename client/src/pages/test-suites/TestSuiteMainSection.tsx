import * as React from "react";
import { TestType, useTestStore } from "../../stores/testStore";
import { useParams } from "react-router-dom";
import { useSnackbar } from "../../hooks/useSnackbar";
import { TestConfig } from "./TestConfig";
import { ExecutionHistory } from "./ExecutionHistory";
import TestsTopSection from "./TestsTopSection";
import TabContext from "@mui/lab/TabContext";
import AssertionsTab from "./AssertionsTab";
import RequestTab from "./RequestTab";

export const TestSuiteMainSection = () => {
  const [saveLoading, setSaveLoading] = React.useState<boolean>(false);
  const { show, component: snackBar } = useSnackbar();
  const { testSuiteId, testId, endpointId } = useParams();
  const [tabNumber, setTabNumber] = React.useState("1");
  const [showConfig, setShowConfig] = React.useState<boolean>(true);
  const [requestHeaders, setRequestHeaders] = React.useState<any[]>([]);

  const { getTest, editTest, setCurrentTest, currentTest } = useTestStore();
  React.useEffect(() => {
    if (!testSuiteId || !testId) {
      return;
    }
    getTest(testSuiteId, testId).then((data: TestType) => {
      setNewHeaders(data);
    });
  }, [testSuiteId, testId]);

  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const DEBOUNCE_TIME_WAIT: number = 2000;

  const setNewHeaders = (test: TestType) => {
    const headers = Object.entries(test?.headers || []).map((h: any) => ({
      name: h[0],
      value: h[1],
    }));
    setRequestHeaders(headers);
  };
  const handleDebounceDataSave = (newTest: TestType) => {
    setCurrentTest(newTest);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      saveTest(testSuiteId, testId, {
        ...newTest,
      });
    }, DEBOUNCE_TIME_WAIT);
  };

  const handleDataSave = (newTest: TestType) => {
    setCurrentTest(newTest);
    saveTest(testSuiteId, testId, {
      ...newTest,
    });
  };

  const saveTest = (
    testSuiteId: string | undefined, testId: string | undefined, currentTest: TestType,
  ) => {
    if (!testSuiteId || !testId || !currentTest) {
      return;
    }
    setSaveLoading(true);
    editTest(testSuiteId, testId, currentTest)
      .catch(() => {
        show("Error saving currentTest", "error");
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  return (
    <>
      {testId && (
        <>
          {snackBar}
          <TestsTopSection
            saveLoading={saveLoading}
            handleSaveAll={() => saveTest(testSuiteId, testId, currentTest)}
            showConfig={showConfig}
            setShowConfig={setShowConfig}
          />
          {currentTest &&
            (showConfig ? (
              <TabContext value={tabNumber}>
                <TestConfig setTabNumber={setTabNumber} />
                <AssertionsTab
                  onDataSave={handleDataSave}
                  onDebounceSave={handleDebounceDataSave}
                  tabNumber={tabNumber}
                />
                <RequestTab
                  onDebounceSave={handleDebounceDataSave}
                  onTestMethodChange={handleDataSave}
                  requestHeaders={requestHeaders}
                  setRequestHeaders={setRequestHeaders}
                />
              </TabContext>
            ) : (
              <ExecutionHistory />
            ))}
        </>
      )}
      {testSuiteId && !testId && endpointId && <ExecutionHistory />}
    </>
  );
};
