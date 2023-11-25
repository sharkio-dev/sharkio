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

  // const handleSaveOperation = (saveFunction: () => Promise<void>) => {
  //   setSaveLoading(true);
  //   saveFunction()
  //     .catch(() => {
  //       show("Error saving test", "error");
  //     })
  //     .finally(() => {
  //       setSaveLoading(false);
  //     });
  // };

  const [headerRules, setHeaderRules] = React.useState<Rule[]>([]);
  const [showConfig, setShowConfig] = React.useState<boolean>(true);
  const { getTest, editTest } = useTestStore();
  let debounceTimeout: any;

  const handleAssertionHeadersChange = (newHeaders: Rule[]) => {
    setHeaderRules(newHeaders);
    handleHeaderSave(newHeaders);
  };

  const handleStatusCodeChange = (newStatusCode: string) => {
    handleSaveStatusCode(newStatusCode);
    setStatusCodeRule({ ...statusCodeRule, expectedValue: newStatusCode });
  };

  const handleBodyChange = (newBody: string) => {
    console.log("try value -->", value);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      console.log("debouce body: " + { value });
      setBodyRule({ ...bodyRule, expectedValue: newBody });
      handleBodySave(newBody);
    }, 2000);
  };

  const handleTestMethodChange = (newTest: TestType) => {
    setTest(newTest);
    handleTestSave(newTest);
  };
  const handleTestChange = (newTest: TestType) => {
    console.log("try value test-->", newTest);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      console.log("debouce test method: " + { newTest });
      setTest(newTest);
      handleTestSave(newTest);
    }, 2000);
  };

  const handleHeaderSave = (newHeaders: Rule[]) => {
    console.log("header assertions save");
    if (!testSuiteId || !testId || !test) {
      return;
    }
    setSaveLoading(true);
    editTest(testSuiteId, testId, {
      ...test,
      rules: [...headerRules, ...newHeaders],
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
  };

  const handleSaveStatusCode = (newStatusCode: string) => {
    console.log("status save");
    if (!testSuiteId || !testId || !test) {
      return;
    }
    setSaveLoading(true);
    editTest(testSuiteId, testId, {
      ...test,
      rules: [{ ...statusCodeRule, expectedValue: newStatusCode }],
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
  };

  const handleTestSave = (newTest: TestType) => {
    console.log("test save");
    if (!testSuiteId || !testId || !test) {
      return;
    }
    setSaveLoading(true);
    editTest(testSuiteId, testId, newTest)
      .then(() => {
        show("Test saved successfully", "success");
      })
      .catch(() => {
        show("Error saving test", "error");
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const handleBodySave = (newBody: string) => {
    console.log("body save");
    console.log({ ...bodyRule, expectedValue: newBody });
    if (!testSuiteId || !testId || !test) {
      return;
    }
    setSaveLoading(true);

    editTest(testSuiteId, testId, {
      ...test,
      rules: [{ ...bodyRule, expectedValue: newBody }],
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
  };

  const hadnleSaveAll = React.useCallback(() => {
    console.log("save all");

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
      handleTestChange(data);
      extractStatusCode(data);
      extractBody(data);
      extractHeaders(data);
    });
  }, [testSuiteId, testId]);

  // console.log({ s: testSuiteId, t: testId, e: endpointId });

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
                        onClick={hadnleSaveAll}
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
                onTestChange={handleTestChange}
                onTestMethodChange={handleTestMethodChange}
                tabNumber={value}
                setTubNumber={setValue}
                statusCodeRule={statusCodeRule}
                onStatusCodeChange={handleStatusCodeChange}
                bodyRule={bodyRule}
                onBodyChange={handleBodyChange}
                headerRules={headerRules}
                onAssertionHeadersChange={handleAssertionHeadersChange}
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
