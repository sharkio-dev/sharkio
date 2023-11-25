import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { SelectComponent } from "./SelectComponent";
import { BodySection } from "./BodySection";
import { HeaderSection } from "./HeaderSection";
import { Rule, TestType } from "../../stores/testStore";
import { TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";

type TestConfigProps = {
  tabNumber: string;
  setTubNumber: (value: string) => void;
  statusCodeRule: Rule;
  setStatusCodeRule: (rule: Rule) => void;
  bodyRule: Rule;
  setBodyRule: (rule: Rule) => void;
  headerRules: Rule[];
  setHeaderRules: (rules: Rule[]) => void;
  test: TestType;
  setTest: (test: TestType) => void;
};
export const TestConfig = ({
  tabNumber,
  setTubNumber,
  statusCodeRule,
  setStatusCodeRule,
  bodyRule,
  setBodyRule,
  headerRules,
  setHeaderRules,
  test,
  setTest,
}: TestConfigProps) => {
  const [testType, setTestType] = React.useState<string>("Status");
  const [requestPart, setRequestPart] = React.useState<string>("Body");

  const handleChange = (_: any, newValue: string) => {
    setTubNumber(newValue);
  };

  const onChangeBodyValue = (value: string) => {
    setBodyRule({ ...bodyRule, expectedValue: value });
  };

  const onChangeStatusCodeValue = (value: string) => {
    setStatusCodeRule({ ...statusCodeRule, expectedValue: value });
  };

  const onChangeHeader = (index: number, value: any, targetPath: string) => {
    const headers = [...headerRules];
    headers[index] = {
      ...headers[index],
      targetPath: targetPath,
      expectedValue: value,
    };
    setHeaderRules(headers);
  };

  return (
    <TabContext value={tabNumber}>
      <div className="flex flex-row items-center justify-between border-b border-border-color">
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Assertions" value="1" />
          <Tab label="Request" value="2" />
        </TabList>
        <div className="flex w-1/4 items-center self-end"></div>
      </div>
      <TabPanel value="1" style={{ padding: 0, paddingTop: 0 }}>
        <ToggleButtonGroup
          color="primary"
          exclusive
          onChange={(_, value) => setTestType(value)}
          className="flex flex-row w-full items-center justify-center mb-8"
          value={testType}
        >
          <ToggleButton value="Status" className="w-24 h-6">
            Status
          </ToggleButton>
          <ToggleButton value="Body" className="w-24 h-6">
            Body
          </ToggleButton>
          <ToggleButton value="Headers" className="w-24 h-6">
            {" "}
            Headers
          </ToggleButton>
        </ToggleButtonGroup>
        {testType === "Status" && (
          <div className="flex flex-row w-full">
            <StatusCodeSelector
              title="Expected Status Code"
              value={statusCodeRule.expectedValue?.toString() || ""}
              setValue={onChangeStatusCodeValue}
            />
          </div>
        )}
        {testType === "Headers" && (
          <HeaderSection
            headers={headerRules.map((rule) => ({
              name: (rule.targetPath as string) || "",
              value: rule.expectedValue,
            }))}
            setHeaders={onChangeHeader}
            addHeader={() =>
              setHeaderRules([
                ...headerRules,
                {
                  type: "header",
                  expectedValue: "",
                  targetPath: "",
                  comparator: "equals",
                },
              ])
            }
            deleteHeader={(index) =>
              setHeaderRules(headerRules.filter((_, i) => i !== index))
            }
          />
        )}
        {testType === "Body" && (
          <BodySection
            body={bodyRule.expectedValue}
            setBody={onChangeBodyValue}
          />
        )}
      </TabPanel>
      <TabPanel value="2" style={{ padding: 0, paddingTop: 16 }}>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-4">
            <div className="flex flex-row w-40">
              <SelectComponent
                options={[
                  { value: "GET", label: "GET" },
                  { value: "POST", label: "POST" },
                  { value: "PUT", label: "PUT" },
                  { value: "PATCH", label: "PATCH" },
                  { value: "DELETE", label: "DELETE" },
                ]}
                title="Method"
                value={test?.method || ""}
                setValue={(value) => {
                  setTest({ ...test, method: value });
                }}
              />
            </div>
            <TextField
              label="URL"
              variant="outlined"
              size="small"
              className="w-full"
              value={test.url}
              onChange={(e) => {
                setTest({ ...test, url: e.target.value });
              }}
            />
          </div>
          <ToggleButtonGroup
            color="primary"
            exclusive
            onChange={(_, value) => setRequestPart(value)}
            className="flex flex-row w-full items-center justify-center mb-8"
            value={requestPart}
          >
            <ToggleButton value="Body" className="w-24 h-6">
              Body
            </ToggleButton>
            <ToggleButton value="Headers" className="w-24 h-6">
              Headers
            </ToggleButton>
          </ToggleButtonGroup>
          {requestPart === "Headers" && (
            <HeaderSection
              headers={Object.entries(test.headers).map((entry) => {
                return { name: entry[0], value: entry[1] };
              })}
              setHeaders={(_, value, targetPath) => {
                console.log("setHeaders", value, targetPath);
              }}
              addHeader={() =>
                // setTest({ ...test, headers: [...test.headers, ""] })
                console.log("add")
              }
              deleteHeader={(index) =>
                setTest({
                  ...test,
                  headers: Object.fromEntries(
                    Object.entries(test.headers).filter((_, i) => i !== index)
                  ),
                })
              }
            />
          )}
          {requestPart === "Body" && (
            <BodySection
              body={test.body}
              setBody={(val) => setTest({ ...test, body: val })}
            />
          )}
        </div>
      </TabPanel>
    </TabContext>
  );
};

export const StatusCodeSelector = ({
  value,
  setValue,
  title,
}: {
  value: string;
  setValue?: (value: string) => void;
  title?: string;
}) => {
  const options = [
    { value: "100", label: "100 Continue" },
    { value: "101", label: "101 Switching Protocols" },
    { value: "102", label: "102 Processing" },
    { value: "103", label: "103 Early Hints" },
    { value: "200", label: "200 OK" },
    { value: "201", label: "201 Created" },
    { value: "202", label: "202 Accepted" },
    { value: "203", label: "203 Non-Authoritative Information" },
    { value: "204", label: "204 No Content" },
    { value: "205", label: "205 Reset Content" },
    { value: "206", label: "206 Partial Content" },
    { value: "207", label: "207 Multi-Status" },
    { value: "208", label: "208 Already Reported" },
    { value: "226", label: "226 IM Used" },
    { value: "300", label: "300 Multiple Choices" },
    { value: "301", label: "301 Moved Permanently" },
    { value: "302", label: "302 Found" },
    { value: "303", label: "303 See Other" },
    { value: "304", label: "304 Not Modified" },
    { value: "305", label: "305 Use Proxy" },
    { value: "306", label: "306 Unused" },
    { value: "307", label: "307 Temporary Redirect" },
    { value: "308", label: "308 Permanent Redirect" },
    { value: "400", label: "400 Bad Request" },
    { value: "401", label: "401 Unauthorized" },
    { value: "402", label: "402 Payment Required" },
    { value: "403", label: "403 Forbidden" },
    { value: "404", label: "404 Not Found" },
    { value: "405", label: "405 Method Not Allowed" },
    { value: "406", label: "406 Not Acceptable" },
    { value: "407", label: "407 Proxy Authentication Required" },
    { value: "408", label: "408 Request Timeout" },
    { value: "409", label: "409 Conflict" },
    { value: "410", label: "410 Gone" },
    { value: "411", label: "411 Length Required" },
    { value: "412", label: "412 Precondition Failed" },
    { value: "413", label: "413 Payload Too Large" },
    { value: "414", label: "414 URI Too Long" },
    { value: "415", label: "415 Unsupported Media Type" },
    { value: "416", label: "416 Range Not Satisfiable" },
    { value: "417", label: "417 Expectation Failed" },
    { value: "418", label: "418 I'm a teapot" },
    { value: "421", label: "421 Misdirected Request" },
    { value: "422", label: "422 Unprocessable Entity" },
    { value: "423", label: "423 Locked" },
    { value: "424", label: "424 Failed Dependency" },
    { value: "425", label: "425 Too Early" },
    { value: "426", label: "426 Upgrade Required" },
    { value: "428", label: "428 Precondition Required" },
    { value: "429", label: "429 Too Many Requests" },
    { value: "431", label: "431 Request Header Fields Too Large" },
    { value: "451", label: "451 Unavailable For Legal Reasons" },
    { value: "500", label: "500 Internal Server Error" },
    { value: "501", label: "501 Not Implemented" },
    { value: "502", label: "502 Bad Gateway" },
    { value: "503", label: "503 Service Unavailable" },
    { value: "504", label: "504 Gateway Timeout" },
    { value: "505", label: "505 HTTP Version Not Supported" },
    { value: "506", label: "506 Variant Also Negotiates" },
    { value: "507", label: "507 Insufficient Storage" },
    { value: "508", label: "508 Loop Detected" },
    { value: "510", label: "510 Not Extended" },
    { value: "511", label: "511 Network Authentication Required" },
  ];

  return (
    <SelectComponent
      options={options}
      title={title || "Status Code"}
      value={value}
      setValue={setValue}
      disabled={!setValue}
    />
  );
};
