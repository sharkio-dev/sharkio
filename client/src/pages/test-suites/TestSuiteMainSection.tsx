import * as React from "react";
import { Rule, TestType, useTestStore } from "../../stores/testStore";
import { useParams } from "react-router-dom";
import { useSnackbar } from "../../hooks/useSnackbar";
import { TestConfig } from "./TestConfig";
import { ExecutionHistory } from "./ExecutionHistory";
import TestsTopSection from "./TestsTopSection";
import TabContext from "@mui/lab/TabContext";
import RequestModal from "./RequestModal";
import AssertionsModal from "./AssertionsModal";

export const TestSuiteMainSection = () => {
  const [saveLoading, setSaveLoading] = React.useState<boolean>(false);
  const { show, component: snackBar } = useSnackbar();
  const { testSuiteId, testId, endpointId } = useParams();
  const [tabNumber, setTabNumber] = React.useState("1");
  const [requestHeaders, setRequestHeaders] = React.useState<any[]>([]);
  const [showConfig, setShowConfig] = React.useState<boolean>(true);
  const { getTest, editTest, setCurrentTest, currentTest } = useTestStore();

  const statusCodeRule = useTestStore((s) =>
    s.currentTest.rules.find((rule) => rule.type === "status_code"),
  ) || {
    type: "status_code",
    expectedValue: "200",
    comparator: "equals",
  };

  const bodyRule = useTestStore((s) =>
    s.currentTest.rules.find((rule) => rule.type === "body"),
  ) || {
    type: "body",
    expectedValue: "",
    comparator: "equals",
  };

  const headerRules = useTestStore((s) =>
    s.currentTest.rules.filter((rule) => rule.type === "header"),
  );

  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const DEBOUNCE_TIME_WAIT: number = 2000;

  const handleAssertionHeadersChange = (newHeaders: Rule[]) => {
    setCurrentTest({
      ...currentTest,
      rules: [statusCodeRule, bodyRule, ...newHeaders],
    });

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      AssertionsDataSave([statusCodeRule, bodyRule, ...newHeaders]);
    }, DEBOUNCE_TIME_WAIT);
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
    AssertionsDataSave([
      { ...statusCodeRule, expectedValue: newStatusCode },
      bodyRule,
      ...headerRules,
    ]);
  };
  const handleAssertionDebounceChange = (newBody: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setCurrentTest({
        ...currentTest,
        rules: [
          statusCodeRule,
          { ...bodyRule, expectedValue: newBody },
          ...headerRules,
        ],
      });
      AssertionsDataSave([
        statusCodeRule,
        { ...bodyRule, expectedValue: newBody },
        ...headerRules,
      ]);
    }, DEBOUNCE_TIME_WAIT);
  };

  const handleRequestHeadersChange = (headersReq: any[]) => {
    console.log(headersReq);
    setRequestHeaders(headersReq);
    const newHeaders = headersReq.reduce((acc, h) => {
      acc[h.name] = h.value;
      return acc;
    }, {} as any);
    setCurrentTest({ ...currentTest, headers: newHeaders });
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (!currentTest) {
        return null;
      }
      console.log({ ...currentTest, headers: newHeaders });
      RequestDataSave({ ...currentTest, headers: newHeaders });
    }, DEBOUNCE_TIME_WAIT);
  };

  const handleRequestChange = (newTest: TestType) => {
    setCurrentTest(newTest);
    RequestDataSave(newTest);
  };

  const handleDebounceRequestChange = (newTest: TestType) => {
    console.log("debounce request");
    setCurrentTest(newTest);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      RequestDataSave(newTest);
    }, DEBOUNCE_TIME_WAIT);
  };

  const AssertionsDataSave = (newAssertions: Rule[]) => {
    console.log("assertions save");
    if (!testSuiteId || !testId || !currentTest) {
      return;
    }
    saveTest(testSuiteId, testId, {
      ...currentTest,
      rules: newAssertions,
    });
  };

  const RequestDataSave = (newTest: TestType) => {
    console.log("request save");
    if (!testSuiteId || !testId || !currentTest) {
      return;
    }
    saveTest(testSuiteId, testId, {
      ...newTest,
      rules: [statusCodeRule, bodyRule, ...headerRules],
    });
  };

  const handleSaveAll = React.useCallback(() => {
    console.log("save all");
    if (!testSuiteId || !testId || !currentTest) {
      return;
    }
    saveTest(testSuiteId, testId, {
      ...currentTest,
      rules: [statusCodeRule, bodyRule, ...headerRules],
    });
    if (!testSuiteId || !testId || !currentTest) {
      return;
    }
  }, [currentTest, testSuiteId, testId, statusCodeRule, bodyRule, headerRules]);

  const saveTest = (
    testSuiteId: string,
    testId: string,
    currentTest: TestType,
  ) => {
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
    console.log(test);
    const headers = Object.entries(test?.headers || []).map((h: any) => ({
      name: h[0],
      value: h[1],
    }));
    setRequestHeaders(headers);
  };
  React.useEffect(() => {
    console.log("extracting headers");
    if (!testSuiteId || !testId) {
      return;
    }
    getTest(testSuiteId, testId).then((data: TestType) => {
      console.log(data);
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
                <AssertionsModal
                  onStatusCodeChange={handleAssertionChange}
                  onBodyChange={handleAssertionDebounceChange}
                  onAssertionHeadersChange={handleAssertionHeadersChange}
                  tabNumber={tabNumber}
                />
                <RequestModal
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
