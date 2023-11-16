import * as React from "react";
import { CiSaveDown2 } from "react-icons/ci";
import { Rule, TestType, getTest } from "../../stores/testStore";
import { useParams } from "react-router-dom";
import { BackendAxios } from "../../api/backendAxios";
import { useSnackbar } from "../../hooks/useSnackbar";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { VscChecklist } from "react-icons/vsc";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { TestConfig } from "./TestConfig";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { FiChevronRight } from "react-icons/fi";
import { Editor } from "@monaco-editor/react";
import { TbAdjustmentsCog } from "react-icons/tb";

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
  console.log({ test });

  const hadnleSave = React.useCallback(() => {
    console.log({ test1: test });
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
          {showConfig && test ? (
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
          )}
        </>
      )}
    </>
  );
};

const ExecutionHistory = () => {
  const { testSuiteId, testId } = useParams();
  const [executions, setExecutions] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  console.log(executions);

  React.useEffect(() => {
    if (!testSuiteId || !testId) {
      return;
    }
    setLoading(true);
    setExecutions([]);
    BackendAxios.get(
      `/test-suites/${testSuiteId}/tests/${testId}/test-executions`,
    )
      .then((res) => {
        setExecutions(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [testSuiteId, testId]);

  return (
    <TableContainer className="border-[1px] border-primary rounded-lg">
      <Table>
        <TableHead>
          <TableRow className="bg-secondary">
            <TableCell style={{ borderBottom: "none" }}>
              {executions.length} executions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell>
                <div className="flex flex-row items-center justify-center">
                  <LoadingIcon />
                </div>
              </TableCell>
            </TableRow>
          )}
          {executions.map((i) => (
            <ExecutionRow
              title={i.request.method + " " + i.request.url}
              status={
                i.checks.every((check: any) => check.isPassed)
                  ? "success"
                  : "failure"
              }
              executionDate={i.testExecution.createdAt}
              passed={i.checks.filter((check: any) => check.isPassed).length}
              failed={i.checks.filter((check: any) => !check.isPassed).length}
              key={i}
              checks={i.checks}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

type ExecutionRowProps = {
  status: "success" | "failure";
  title: string;
  passed: number;
  failed: number;
  executionDate: string;
  checks: {
    type: "status_code" | "header" | "body";
    isPassed: boolean;
    expectedValue: string;
    actualValue: string;
    targetPath: string;
    comparator: "equals";
  }[];
};

const ExecutionRow = ({
  status,
  title,
  passed,
  failed,
  checks,
  executionDate,
}: ExecutionRowProps) => {
  const [show, setShow] = React.useState<boolean>(false);

  return (
    <TableRow className="border-t-[1px] border-primary h-10 w-full">
      <div className="flex flex-col items-center w-full p-4 space-y-4">
        <div
          className="flex flex-row items-center justify-between hover:cursor-pointer active:bg-secondary transition-all duration-500 w-full"
          onClick={() => setShow(!show)}
        >
          <div className="flex flex-row items-center space-x-4">
            {status === "failure" ? (
              <AiOutlineCloseCircle className="text-red-400 text-2xl" />
            ) : (
              <AiOutlineCheckCircle className="text-green-400 text-2xl" />
            )}
            <div className="flex flex-col h-full">
              <span className="text-lg font-bold hover:cursor-pointer hover:scale-105">
                {title}
              </span>
              <span className="text-xs">
                {new Date(executionDate).toDateString()}
              </span>
            </div>
          </div>
          <div className="flex flex-row items-center space-x-4">
            <div className="flex flex-col h-full">
              <span className="text-xs">Passed: {passed}</span>
              <span className="text-xs">Errors: {failed}</span>
            </div>
            {show ? (
              <FiChevronRight className="text-gray-400 text-2xl transform rotate-90" />
            ) : (
              <FiChevronRight className="text-gray-400 text-2xl" />
            )}
          </div>
        </div>
        {show && (
          <div className="flex flex-col bg-primary rounded-lg w-full transition-all duration-500 border-[1px] border-border-color ">
            {checks.map((check, i) => (
              <ExecutionDetails
                targetPath={check.targetPath}
                status={check.isPassed ? "success" : "failure"}
                type={check.type}
                key={i}
                expectedValue={check.expectedValue}
                actualValue={check.actualValue}
              />
            ))}
          </div>
        )}
      </div>
    </TableRow>
  );
};

type ExecutionDetailsProps = {
  status?: "success" | "failure";
  type?: "status_code" | "header" | "body";
  expectedValue: string;
  actualValue: string;
  targetPath: string;
};

const ExecutionDetails = ({
  status = "success",
  type,
  expectedValue,
  actualValue,
  targetPath,
}: ExecutionDetailsProps) => {
  const [show, setShow] = React.useState<boolean>(false);
  return (
    <div className="flex flex-col items-center w-full space-y-4 border-b-[1px] border-border-color">
      <div className="flex flex-row items-center  h-10 w-full">
        <div className="flex flex-row items-center justify-between w-full px-4">
          <div className="flex flex-row items-center space-x-4">
            {status === "success" && (
              <span className="text text-green-400 text-xs font-bold">
                PASSED
              </span>
            )}
            {status === "failure" && (
              <span className="text text-red-400 text-xs font-bold">
                FAILED
              </span>
            )}
            <span className="text text-xs">
              {type === "status_code" && "Status Code"}
              {type === "header" && "Header"}
              {type === "body" && "Body"}
            </span>
          </div>
          <span
            className="text text-xs text-blue-400 font-bold hover:cursor-pointer hover:scale-105 active:scale-100"
            onClick={() => setShow(!show)}
          >
            {!show ? "Show Details" : "Hide Details"}
          </span>
        </div>
      </div>
      {type === "status_code" && show && (
        <StatusCodeDetails
          status={status}
          key={type}
          expectedValue={expectedValue}
          actualValue={actualValue}
        />
      )}
      {type === "header" && show && (
        <HeaderDetails
          status={status}
          key={type}
          expectedHeaderName={targetPath}
          expectedHeaderValue={expectedValue}
          actualHeaderName={targetPath}
          actualHeaderValue={actualValue}
        />
      )}
      {type === "body" && show && (
        <BodyDetails
          status={status}
          key={type}
          actualValue={actualValue}
          expectedValue={expectedValue}
        />
      )}
    </div>
  );
};

const StatusCodeDetails = ({
  status = "success",
  expectedValue,
  actualValue,
}: {
  status: "success" | "failure";
  expectedValue: string;
  actualValue: string;
}) => {
  return (
    <div className="flex flex-row items-center w-full py rounded-lg pb-4 space-x-4 px-4">
      <div className="flex flex-row items-center w-1/2 h-full border-r-secondary border-r bg-secondary rounded-lg p-4">
        <span className="text text-xs">
          Expected Status Code - {expectedValue}
        </span>
      </div>
      <div className="flex flex-row items-center w-1/2 h-full border-r-secondary border-r bg-secondary rounded-lg p-4">
        <span className="text text-xs">
          {status === "success" ? (
            <span className="text-green-400 mr-2">✓</span>
          ) : (
            <span className="text-red-400 mr-2">✗</span>
          )}
          Actual Status Code - {actualValue}
        </span>
      </div>
    </div>
  );
};

type HeaderDetailsProps = {
  status?: "success" | "failure";
  expectedHeaderName: string;
  expectedHeaderValue: string;
  actualHeaderName: string;
  actualHeaderValue: string;
};

const HeaderDetails = ({
  status = "success",
  expectedHeaderName,
  expectedHeaderValue,
  actualHeaderName,
  actualHeaderValue,
}: HeaderDetailsProps) => {
  return (
    <div className="flex flex-row items-center w-full py rounded-lg pb-4 space-x-4 px-4">
      <div className="flex flex-row items-center w-1/2 h-full border-r-secondary border-r bg-secondary rounded-lg p-4">
        <div className="flex flex-col">
          <span className="text text-xs">
            Expected Header - {expectedHeaderName}
          </span>
          <span className="text text-xs">
            Expected Value - {expectedHeaderValue}
          </span>
        </div>
      </div>
      <div className="flex flex-row items-center w-1/2 h-full border-r-secondary border-r bg-secondary rounded-lg p-4">
        {status === "success" ? (
          <span className="text-green-400 mr-2">✓</span>
        ) : (
          <span className="text-red-400 mr-2">✗</span>
        )}
        <div className="flex flex-col">
          <span className="text text-xs">
            Actual Header - {actualHeaderName}
          </span>
          <span className="text text-xs">
            Actual Value - {actualHeaderValue}
          </span>
        </div>
      </div>
    </div>
  );
};

type BodyDetailsProps = {
  status?: "success" | "failure";
  expectedValue: string;
  actualValue: string;
};

const BodyDetails = ({
  status = "success",
  expectedValue,
  actualValue,
}: BodyDetailsProps) => {
  return (
    <div className="flex flex-row items-center w-full py rounded-lg pb-4 space-x-4 px-4">
      <div className="flex flex-row items-center w-1/2 h-full border-r-secondary border-r bg-secondary rounded-lg p-4">
        <Editor
          height={"20vh"}
          theme="vs-dark"
          defaultLanguage="json"
          value={expectedValue}
          options={{
            readOnly: true,
            minimap: {
              enabled: false,
            },
          }}
        />
      </div>
      <div className="flex flex-row items-center w-1/2 h-full border-r-secondary border-r bg-secondary rounded-lg p-4">
        <span className="text text-xs">
          {status === "success" ? (
            <span className="text-green-400">✓</span>
          ) : (
            <span className="text-red-400">✗</span>
          )}
        </span>
        <Editor
          height={"20vh"}
          theme="vs-dark"
          defaultLanguage="json"
          value={actualValue}
          options={{
            readOnly: true,
            minimap: {
              enabled: false,
            },
          }}
        />
      </div>
    </div>
  );
};
