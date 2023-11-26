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
  const [showConfig, setShowConfig] = React.useState<boolean>(true);
  const { getTest, editTest } = useTestStore();
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const DEBOUNCE_TIME_WAIT: number = 2000;

  //pretty similar maybe can put them together
  const handleAssertionHeadersChange = (newHeaders: Rule[]) => {
    console.log("headers ass try");
    setHeaderRules([...newHeaders]);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      console.log("headers ass CHANGE");
      console.log(...newHeaders);
      console.log(headerRules);
      handleAssertionsSave([statusCodeRule, bodyRule, ...newHeaders]);
    }, DEBOUNCE_TIME_WAIT);
  };

  const handleAssertionStatusCodeChange = (newStatusCode: string) => {
    setStatusCodeRule({ ...statusCodeRule, expectedValue: newStatusCode });
    handleAssertionsSave([
      { ...statusCodeRule, expectedValue: newStatusCode },
      bodyRule,
      ...headerRules,
    ]);
  };

  const handleAssertionBodyChange = (newBody: string) => {
    console.log("try value debounce body assertion-->", value);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setBodyRule({ ...bodyRule, expectedValue: newBody });
      //handleBodySave(newBody);
      handleAssertionsSave([
        statusCodeRule,
        { ...bodyRule, expectedValue: newBody },
        ...headerRules,
      ]);
    }, 2000);
  };

  const handleRequestHeadersChange = (headersReq: any[]) => {
    console.log("headersReq", headersReq);
    console.log("headers test", test?.headers.headers);
    //not working
    setTest((prevTest) => {
      if (!prevTest) {
        return null;
      }
      const newHeaders = headersReq.reduce((acc, header, index) => {
        const headerName = header.name || `header${index + 1}`;
        return { ...acc, [headerName]: header.value };
      }, {});
      console.log("newHeaders", newHeaders);
      return {
        ...prevTest,
        headers: newHeaders,
      };
    });
  };

  const handleRequestChange = (newTest: TestType) => {
    console.log("try value test request no debounce-->", newTest);
    setTest(newTest);
    handleRequestSave(newTest);
  };

  const handleDebounceRequestChange = (newTest: TestType) => {
    console.log("try value test change debounce-->", newTest);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      console.log("debouce test method: " + { newTest });
      setTest(newTest);
      handleRequestSave(newTest);
    }, 2000);
  };

  const handleAssertionsSave = (newAssertions: Rule[]) => {
    console.log("assertions save");
    console.log(newAssertions);
    if (!testSuiteId || !testId || !test) {
      return;
    }
    setSaveLoading(true);
    editTest(testSuiteId, testId, {
      ...test,
      rules: newAssertions,
    })
      .catch(() => {
        show("Error saving test", "error");
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const handleRequestSave = (newTest: TestType) => {
    console.log("test save");
    if (!testSuiteId || !testId || !test) {
      return;
    }
    setSaveLoading(true);
    editTest(testSuiteId, testId, newTest)
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
      handleDebounceRequestChange(data);
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
                onTestChange={handleDebounceRequestChange}
                onTestMethodChange={handleRequestChange}
                tabNumber={value}
                setTubNumber={setValue}
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
