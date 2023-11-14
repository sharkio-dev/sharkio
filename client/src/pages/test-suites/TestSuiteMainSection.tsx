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

  const hadnleSave = () => {
    setSaveLoading(true);
    BackendAxios.put(`/test-suites/${testSuiteId}/tests/${testId}`, {
      name: test?.name,
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
                    <CiSaveDown2
                      className="text-blue-400 text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
                      onClick={hadnleSave}
                    />
                  </Tooltip>
                ) : (
                  <LoadingIcon />
                )
              ) : (
                <></>
              )}
              {showConfig ? (
                <Tooltip title="Execution History" arrow>
                  <VscChecklist
                    className="text-blue-400 text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
                    onClick={() => setShowConfig(!showConfig)}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Config" arrow>
                  <TbAdjustmentsCog
                    className="text-blue-400 text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
                    onClick={() => setShowConfig(!showConfig)}
                  />
                </Tooltip>
              )}
            </div>
          </div>
          {showConfig ? (
            <TestConfig
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
  return (
    <TableContainer className="border-[1px] border-primary rounded-lg">
      <Table>
        <TableHead>
          <TableRow className="bg-secondary">
            <TableCell style={{ borderBottom: "none" }}>4 executions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[1, 2, 3, 4].map((i) => (
            <ExecutionRow
              status={i % 2 === 0 ? "success" : "failure"}
              key={i}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

type ExecutionRowProps = {
  status: "success" | "failure";
};

const ExecutionRow = ({ status }: ExecutionRowProps) => {
  const [show, setShow] = React.useState<boolean>(false);

  return (
    <TableRow className="border-t-[1px] border-primary h-10 w-full">
      <div className="flex flex-col items-center w-full p-4 space-y-4">
        <div
          className="flex flex-row items-center justify-between hover:cursor-pointer active:bg-secondary transition-all duration-500 w-full"
          onClick={() => setShow(!show)}
        >
          <div className="flex flex-row items-center space-x-4">
            {status === "success" ? (
              <AiOutlineCloseCircle className="text-red-400 text-2xl" />
            ) : (
              <AiOutlineCheckCircle className="text-green-400 text-2xl" />
            )}
            <div className="flex flex-col h-full">
              <span className="text-lg font-bold hover:cursor-pointer hover:scale-105">
                Method-Endpoint
              </span>
              <span className="text-xs">{new Date().toDateString()}</span>
            </div>
          </div>
          <div className="flex flex-row items-center space-x-4">
            <div className="flex flex-col h-full">
              <span className="text-xs">Passed: 4</span>
              <span className="text-xs">Errors: 0</span>
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
            <ExecutionDetails type="status_code" status={status} />
            <ExecutionDetails status="failure" type="header" />
            <ExecutionDetails status="success" type="body" />
            <ExecutionDetails status="success" type="body" />
          </div>
        )}
      </div>
    </TableRow>
  );
};

type ExecutionDetailsProps = {
  status?: "success" | "failure";
  type?: "status_code" | "header" | "body";
};

const ExecutionDetails = ({
  status = "success",
  type,
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
        <StatusCodeDetails status={status} key={type} />
      )}
      {type === "header" && show && (
        <HeaderDetails status={status} key={type} />
      )}
      {type === "body" && show && <BodyDetails status={status} key={type} />}
    </div>
  );
};

const StatusCodeDetails = ({ status = "success" }) => {
  return (
    <div className="flex flex-row items-center w-full py rounded-lg pb-4 space-x-4 px-4">
      <div className="flex flex-row items-center w-1/2 h-full border-r-secondary border-r bg-secondary rounded-lg p-4">
        <span className="text text-xs">Expected Status Code - 200</span>
      </div>
      <div className="flex flex-row items-center w-1/2 h-full border-r-secondary border-r bg-secondary rounded-lg p-4">
        <span className="text text-xs">
          {status === "success" ? (
            <span className="text-green-400 mr-2">✓</span>
          ) : (
            <span className="text-red-400 mr-2">✗</span>
          )}
          Actual Status Code - 200
        </span>
      </div>
    </div>
  );
};

const HeaderDetails = ({ status = "success" }) => {
  return (
    <div className="flex flex-row items-center w-full py rounded-lg pb-4 space-x-4 px-4">
      <div className="flex flex-row items-center w-1/2 h-full border-r-secondary border-r bg-secondary rounded-lg p-4">
        <div className="flex flex-col">
          <span className="text text-xs">Expected Header - Content-Type</span>
          <span className="text text-xs">
            Expected Value - application/json
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
          <span className="text text-xs">Actual Header - Content-Type</span>
          <span className="text text-xs">Actual Value - application/json</span>
        </div>
      </div>
    </div>
  );
};

const BodyDetails = ({ status = "success" }) => {
  return (
    <div className="flex flex-row items-center w-full py rounded-lg pb-4 space-x-4 px-4">
      <div className="flex flex-row items-center w-1/2 h-full border-r-secondary border-r bg-secondary rounded-lg p-4">
        <Editor
          height={"20vh"}
          theme="vs-dark"
          defaultLanguage="json"
          value={""}
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
          value={""}
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
