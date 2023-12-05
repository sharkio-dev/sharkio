import * as React from "react";
import { Rule, TestType, useTestStore } from "../../stores/testStore";
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
  const [requestHeaders, setRequestHeaders] = React.useState<any[]>([]);
  const [showConfig, setShowConfig] = React.useState<boolean>(true);
  const {
    getRuleFromCurrentTest: getRule,
    getTest,
    editTest,
    setCurrentTest,
    currentTest,
  } = useTestStore();

  const statusCodeRule = getRule("status_code") || {
    type: "status_code",
    expectedValue: "200",
    comparator: "equals",
  };
  const bodyRule = getRule("body") || {
    type: "body",
    expectedValue: "",
    comparator: "equals",
  };

  const headerRules = useTestStore((s) => {
    return (s.currentTest.rules as Rule[]).filter(
      (rule) => rule.type === "header",
    );
  });

  // why react.hooks and not just get the hooks in import from react?
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

  const handleDebounce = (newData: any, saveFunction: (data: any) => void) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      saveFunction(newData);
    }, DEBOUNCE_TIME_WAIT);
  };

  const setNewHeaders = (test: TestType) => {
    const headers = Object.entries(test?.headers || []).map((h: any) => ({
      name: h[0],
      value: h[1],
    }));
    setRequestHeaders(headers);
  };

  const handleAssertionHeadersChange = (newHeaders: Rule[]) => {
    setCurrentTest({
      ...currentTest,
      rules: [statusCodeRule, bodyRule, ...newHeaders],
    });
    handleDebounce(
      [statusCodeRule, bodyRule, ...newHeaders],
      AssertionsDataSave,
    );
  };
  const handleStatusCodeChange = (newStatusCode: string) => {
    setCurrentTest({
      ...currentTest,
      rules: [
        { ...statusCodeRule, expectedValue: newStatusCode },
        bodyRule,
        ...headerRules,
      ],
    });

    AssertionsDataSave([
      { ...statusCodeRule, expectedValue: newStatusCode },
      bodyRule,
      ...headerRules,
    ]);
  };

  const handleAssertionBodyChange = (newBody: string) => {
    setCurrentTest({
      ...currentTest,
      rules: [
        statusCodeRule,
        { ...bodyRule, expectedValue: newBody },
        ...headerRules,
      ],
    });
    handleDebounce(
      [statusCodeRule, { ...bodyRule, expectedValue: newBody }, ...headerRules],
      AssertionsDataSave,
    );
  };

  const handleRequestHeadersChange = (headersReq: any[]) => {
    setRequestHeaders(headersReq);
    setCurrentTest({
      ...currentTest,
      headers: headersReq.reduce((acc, h) => {
        acc[h.name] = h.value;
        return acc;
      }, {} as any),
    });
    handleDebounce(
      {
        ...currentTest,
        headers: headersReq.reduce((acc, h) => {
          acc[h.name] = h.value;
          return acc;
        }, {} as any),
      },
      RequestDataSave,
    );
  };

  const handleTestMethodChange = (newTest: TestType) => {
    setCurrentTest(newTest);
    RequestDataSave(newTest);
  };

  const handleDebounceRequestChange = (newTest: TestType) => {
    setCurrentTest(newTest);
    handleDebounce(newTest, RequestDataSave);
  };

  const AssertionsDataSave = (newAssertions: Rule[]) => {
    saveTest(testSuiteId, testId, {
      ...currentTest,
      rules: newAssertions,
    });
  };

  const RequestDataSave = (newTest: TestType) => {
    saveTest(testSuiteId, testId, {
      ...newTest,
      rules: [statusCodeRule, bodyRule, ...headerRules],
    });
  };

  const handleSaveAll = () => {
    saveTest(testSuiteId, testId, {
      ...currentTest,
      rules: [statusCodeRule, bodyRule, ...headerRules],
    });
  };

  const saveTest = (
    testSuiteId: string | undefined,
    testId: string | undefined,
    currentTest: TestType,
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
            handleSaveAll={handleSaveAll}
            showConfig={showConfig}
            setShowConfig={setShowConfig}
          />
          {currentTest &&
            (showConfig ? (
              <TabContext value={tabNumber}>
                <TestConfig setTabNumber={setTabNumber} />
                <AssertionsTab
                  onStatusCodeChange={handleStatusCodeChange}
                  onBodyChange={handleAssertionBodyChange}
                  onAssertionHeadersChange={handleAssertionHeadersChange}
                  tabNumber={tabNumber}
                />
                <RequestTab
                  requestHeaders={requestHeaders}
                  onDebounceRequestChange={handleDebounceRequestChange}
                  onTestMethodChange={handleTestMethodChange}
                  onRequestHeadersChange={handleRequestHeadersChange}
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
