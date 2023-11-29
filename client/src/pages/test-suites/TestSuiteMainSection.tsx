import * as React from "react";
import { Rule, TestType, useTestStore } from "../../stores/testStore";
import { useParams } from "react-router-dom";
import { useSnackbar } from "../../hooks/useSnackbar";
import { TestConfig } from "./TestConfig";
import { ExecutionHistory } from "./ExecutionHistory";
import TestsTopSection from "./TestsTopSection";

export const TestSuiteMainSection = () => {
  const [test, setTest] = React.useState<TestType | null>(null);
  const [saveLoading, setSaveLoading] = React.useState<boolean>(false);
  const { show, component: snackBar } = useSnackbar();
  const { testSuiteId, testId, endpointId } = useParams();
  const [statusCodeRule, setStatusCodeRule] = React.useState<Rule>({
    type: "status_code",
    expectedValue: "200",
    comparator: "equals",
  });
  const [bodyRule, setBodyRule] = React.useState<Rule>({
    type: "body",
    expectedValue: "",
    comparator: "equals",
  });

  const [headerRules, setHeaderRules] = React.useState<Rule[]>([]);
  const [showConfig, setShowConfig] = React.useState<boolean>(true);
  const { getTest, editTest } = useTestStore();
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const DEBOUNCE_TIME_WAIT: number = 2000;

  //make debounce functions together with if statement?
  //make save functions together with if statement?
  const handleAssertionHeadersChange = (newHeaders: Rule[]) => {
    setHeaderRules([...newHeaders]);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      AssertionsDataSave([statusCodeRule, bodyRule, ...newHeaders]);
    }, DEBOUNCE_TIME_WAIT);
  };

  const handleAssertionStatusCodeChange = (newStatusCode: string) => {
    setStatusCodeRule({ ...statusCodeRule, expectedValue: newStatusCode });
    AssertionsDataSave([
      { ...statusCodeRule, expectedValue: newStatusCode },
      bodyRule,
      ...headerRules,
    ]);
  };

  const handleAssertionBodyChange = (newBody: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setBodyRule({ ...bodyRule, expectedValue: newBody });
      AssertionsDataSave([
        statusCodeRule,
        { ...bodyRule, expectedValue: newBody },
        ...headerRules,
      ]);
    }, 2000);
  };

  const handleRequestHeadersChange = (headersReq: TestType["headers"]) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    setTest((prevTest: TestType | null) => {
      if (!prevTest) {
        return null;
      }
      return {
        ...prevTest,
        headers: headersReq,
      };
    });
    debounceTimeout.current = setTimeout(() => {
      if (!test) {
        return null;
      }
      RequestDataSave({ ...test, headers: headersReq });
    }, DEBOUNCE_TIME_WAIT);
  };

  const handleRequestChange = (newTest: TestType) => {
    setTest(newTest);
    RequestDataSave(newTest);
  };

  const handleDebounceRequestChange = (newTest: TestType) => {
    console.log("debounce request");
    setTest(newTest);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      RequestDataSave(newTest);
    }, 2000);
  };

  const AssertionsDataSave = (newAssertions: Rule[]) => {
    console.log("assertions save");
    if (!testSuiteId || !testId || !test) {
      return;
    }
    saveTest(testSuiteId, testId, {
      ...test,
      rules: newAssertions,
    });
  };

  const RequestDataSave = (newTest: TestType) => {
    console.log("request save");
    if (!testSuiteId || !testId || !test) {
      return;
    }
    saveTest(testSuiteId, testId, {
      ...newTest,
      rules: [statusCodeRule, bodyRule, ...headerRules],
    });
  };

  const handleSaveAll = React.useCallback(() => {
    console.log("save all");
    if (!testSuiteId || !testId || !test) {
      return;
    }
    saveTest(testSuiteId, testId, {
      ...test,
      rules: [statusCodeRule, bodyRule, ...headerRules],
    });
    if (!testSuiteId || !testId || !test) {
      return;
    }
  }, [test, testSuiteId, testId, statusCodeRule, bodyRule, headerRules]);

  const saveTest = (testSuiteId: string, testId: string, test: TestType) => {
    setSaveLoading(true);

    editTest(testSuiteId, testId, test)
      .then(() => {
        // show("Test saved successfully", "success");
      })
      .catch(() => {
        show("Error saving test", "error");
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };
  const extractStatusCode = (test: TestType) => {
    test.rules.forEach((rule) => {
      if (rule.type === "status_code") {
        setStatusCodeRule(rule);
      }
    });
  };

  const extractBody = (test: TestType) => {
    test.rules.forEach((rule) => {
      if (rule.type === "body") {
        setBodyRule(rule);
      }
    });
  };

  const extractHeaders = (test: TestType) => {
    const headers: Rule[] = [];
    test.rules.forEach((rule) => {
      if (rule.type === "header") {
        headers.push(rule);
      }
    });
    setHeaderRules(headers);
  };

  React.useEffect(() => {
    if (!testSuiteId || !testId) {
      return;
    }
    getTest(testSuiteId, testId).then((data: TestType) => {
      handleDebounceRequestChange(data);
      extractStatusCode(data);
      extractBody(data);
      extractHeaders(data);
    });
  }, [testSuiteId, testId]);

  return (
    <>
      {testId && (
        <>
          {snackBar}
          <TestsTopSection
            test={test}
            saveLoading={saveLoading}
            handleSaveAll={handleSaveAll}
            showConfig={showConfig}
            setShowConfig={setShowConfig}
          />
          {test &&
            (showConfig ? (
              <TestConfig
                test={test}
                onTestChange={handleDebounceRequestChange}
                onTestMethodChange={handleRequestChange}
                statusCodeRule={statusCodeRule}
                onStatusCodeChange={handleAssertionStatusCodeChange}
                bodyRule={bodyRule}
                onBodyChange={handleAssertionBodyChange}
                headerRules={headerRules}
                onAssertionHeadersChange={handleAssertionHeadersChange}
                onRequestHeadersChange={handleRequestHeadersChange}
              />
            ) : (
              <ExecutionHistory />
            ))}
        </>
      )}
      {testSuiteId && !testId && endpointId && <ExecutionHistory />}
    </>
  );
};
