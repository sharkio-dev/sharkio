import * as React from "react";
import { CiSaveDown2 } from "react-icons/ci";
import { Rule, TestType, useTestStore } from "../../stores/testStore";
import { useParams } from "react-router-dom";
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
  const [showConfig, setShowConfig] = React.useState<boolean>(false);
  const { getTest, editTest } = useTestStore();

  const hadnleSave = React.useCallback(() => {
    if (!testSuiteId || !testId || !test) {
      return;
    }
    setSaveLoading(true);

    editTest(testSuiteId, testId, {
      ...test,
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
    getTest(testSuiteId, testId).then((data) => {
      setTest(data);
      extractStatusCode(data);
      extractBody(data);
      extractHeaders(data);
    });
  }, [testSuiteId, testId]);

  console.log({ s: testSuiteId, t: testId, e: endpointId });

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
      {testSuiteId && !testId && endpointId && <ExecutionHistory />}
    </>
  );
};
