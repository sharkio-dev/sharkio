import * as React from "react";
import { Rule, TestType, useTestStore } from "../../stores/testStore";
import { useParams } from "react-router-dom";
import { useSnackbar } from "../../hooks/useSnackbar";
import { TestConfig } from "./TestConfig";
import { ExecutionHistory } from "./ExecutionHistory";
import TestsTopSection from "./TestsTopSection";
import TabContext from "@mui/lab/TabContext";
import RequestTab from "./RequestModal";
import AssertionsTab from "./AssertionsModal";

export const TestSuiteMainSection = () => {
  const [saveLoading, setSaveLoading] = React.useState<boolean>(false);
  const { show, component: snackBar } = useSnackbar();
  const { testSuiteId, testId, endpointId } = useParams();
  const [tabNumber, setTabNumber] = React.useState("1");
  const [requestHeaders, setRequestHeaders] = React.useState<any[]>([]);
  const [showConfig, setShowConfig] = React.useState<boolean>(true);
  const { getRule, getTest, editTest, setCurrentTest, currentTest } =
    useTestStore();

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

  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const DEBOUNCE_TIME_WAIT: number = 2000;

  const handleDebounce = (newData: any, saveFunction: (data: any) => void) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    setCurrentTest(newData);

    debounceTimeout.current = setTimeout(() => {
      saveFunction(newData);
    }, DEBOUNCE_TIME_WAIT);
  };

  const handleAssertionHeadersChange = (newHeaders: Rule[]) => {
    handleDebounce(
      {
        ...currentTest,
        rules: [statusCodeRule, bodyRule, ...newHeaders],
      },
      AssertionsDataSave,
    );
  };
  const handleAssertionChange = (newStatusCode: string) => {
    setCurrentTest({
      ...currentTest,
      rules: [
        { ...statusCodeRule, expectedValue: newStatusCode },
        bodyRule,
        ...headerRules,
      ],
    });

    AssertionsDataSave({
      ...currentTest,
      rules: [
        { ...statusCodeRule, expectedValue: newStatusCode },
        bodyRule,
        ...headerRules,
      ],
    });
  };

  const handleAssertionDebounceChange = (newBody: string) => {
    handleDebounce(
      {
        ...currentTest,
        rules: [
          statusCodeRule,
          { ...bodyRule, expectedValue: newBody },
          ...headerRules,
        ],
      },
      AssertionsDataSave,
    );
  };

  const handleRequestHeadersChange = (headersReq: any[]) => {
    setRequestHeaders(headersReq);
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

  const handleRequestChange = (newTest: TestType) => {
    setCurrentTest(newTest);
    RequestDataSave(newTest);
  };

  const handleDebounceRequestChange = (newTest: TestType) => {
    handleDebounce(newTest, RequestDataSave);
  };

  const AssertionsDataSave = (newAssertions: TestType) => {
    saveTest(testSuiteId, testId, {
      ...newAssertions,
    });
  };

  const RequestDataSave = (newTest: TestType) => {
    saveTest(testSuiteId, testId, {
      ...newTest,
      rules: [statusCodeRule, bodyRule, ...headerRules],
    });
  };

  const handleSaveAll = React.useCallback(() => {
    saveTest(testSuiteId, testId, {
      ...currentTest,
      rules: [statusCodeRule, bodyRule, ...headerRules],
    });
  }, [currentTest, testSuiteId, testId, statusCodeRule, bodyRule, headerRules]);

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

  const setNewHeaders = (test: TestType) => {
    const headers = Object.entries(test?.headers || []).map((h: any) => ({
      name: h[0],
      value: h[1],
    }));
    setRequestHeaders(headers);
  };

  React.useEffect(() => {
    if (!testSuiteId || !testId) {
      return;
    }
    getTest(testSuiteId, testId).then((data: TestType) => {
      setNewHeaders(data);
    });
  }, [testSuiteId, testId]);

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
                  onStatusCodeChange={handleAssertionChange}
                  onBodyChange={handleAssertionDebounceChange}
                  onAssertionHeadersChange={handleAssertionHeadersChange}
                  tabNumber={tabNumber}
                />
                <RequestTab
                  requestHeaders={requestHeaders}
                  onTestChange={handleDebounceRequestChange}
                  onTestMethodChange={handleRequestChange}
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
