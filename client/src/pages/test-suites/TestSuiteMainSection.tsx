import * as React from "react";
import { CiSaveDown2 } from "react-icons/ci";
import { Rule, TestType, getTest } from "../../stores/testStore";
import { useParams } from "react-router-dom";
import { BackendAxios } from "../../api/backendAxios";
import { useSnackbar } from "../../hooks/useSnackbar";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { VscChecklist } from "react-icons/vsc";
import { Tooltip } from "@mui/material";
import { TestConfig } from "./TestConfig";
import { TbAdjustmentsCog } from "react-icons/tb";
import { ExecutionHistory } from "./ExecutionHistory";

export const TestSuiteMainSection = () => {
  const [test, setTest] = React.useState<TestType | null>(null);
  const [value, setValue] = React.useState("1");
  const [saveLoading, setSaveLoading] = React.useState<boolean>(false);
  const { show, component: snackBar } = useSnackbar();
  const { testSuiteId, testId } = useParams();
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

  const hadnleSave = React.useCallback(() => {
    if (!testSuiteId || !testId || !test) {
      return;
    }
    setSaveLoading(true);
    BackendAxios.put(`/test-suites/${testSuiteId}/tests/${testId}`, {
      name: test?.name,
      headers: test?.headers,
      body: test?.body,
      url: test?.url,
      method: test?.method,
      rules: [statusCodeRule, bodyRule, ...headerRules],
    })
      .then(() => {
        show("Test saved successfully", "success");
      })
      .catch(() => {
        show("Error saving test", "error");
      })
      .finally(() => {
        setSaveLoading(false);
      });
  }, [test, testSuiteId, testId, statusCodeRule, bodyRule, headerRules]);

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
    getTest(testSuiteId, testId).then((res) => {
      setTest(res.data);
      extractStatusCode(res.data);
      extractBody(res.data);
      extractHeaders(res.data);
    });
  }, [testSuiteId, testId]);

  return (
    <>
      {testId && (
        <>
          <div className="flex flex-row items-center justify-between">
            {snackBar}
            <span className="text-white text-xl font-bold">{test?.name}</span>
            <div className="flex items-center h-full space-x-4">
              {showConfig ? (
                !saveLoading ? (
                  <Tooltip title="Save" arrow>
                    <div>
                      <CiSaveDown2
                        className="text-blue-400 text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
                        onClick={hadnleSave}
                      />
                    </div>
                  </Tooltip>
                ) : (
                  <LoadingIcon />
                )
              ) : (
                <></>
              )}
              {showConfig ? (
                <Tooltip title="Tests" arrow>
                  <div>
                    <VscChecklist
                      className="text-blue-400 text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
                      onClick={() => setShowConfig(!showConfig)}
                    />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip title="Config" arrow>
                  <div>
                    <TbAdjustmentsCog
                      className="text-blue-400 text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
                      onClick={() => setShowConfig(!showConfig)}
                    />
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
          {test &&
            (showConfig ? (
              <TestConfig
                test={test}
                setTest={setTest}
                tabNumber={value}
                setTubNumber={setValue}
                statusCodeRule={statusCodeRule}
                setStatusCodeRule={setStatusCodeRule}
                bodyRule={bodyRule}
                setBodyRule={setBodyRule}
                headerRules={headerRules}
                setHeaderRules={setHeaderRules}
              />
            ) : (
              <ExecutionHistory />
            ))}
        </>
      )}
    </>
  );
};
