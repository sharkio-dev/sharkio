import * as React from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { SelectComponent } from "./SelectComponent";
import { BodySection } from "./BodySection";
import { HeaderSection } from "./HeaderSection";
import { CiSaveDown2 } from "react-icons/ci";
import { TestType } from "../../stores/testStore";
import { useParams } from "react-router-dom";
import { BackendAxios } from "../../api/backendAxios";

export const TestSuiteMainSection = () => {
  const [value, setValue] = React.useState("1");
  const [test, setTest] = React.useState<TestType | null>(null);
  const { testSuiteId, testId } = useParams();
  const [statusCode, setStatusCode] = React.useState<string>();
  const [body, setBody] = React.useState<string>();
  const [headers, setHeaders] =
    React.useState<{ name: string; value: string }[]>();

  console.log({ statusCode });
  console.log({ body });
  console.log({ headers });
  console.log({ testRules: test?.rules });

  const extractStatusCode = (test: TestType) => {
    test.rules.forEach((rule) => {
      if (rule.type === "status_code") {
        setStatusCode(rule.expectedValue);
      }
    });
  };

  const extractBody = (test: TestType) => {
    test.rules.forEach((rule) => {
      if (rule.type === "body") {
        setBody(rule.expectedValue);
      }
    });
  };

  const extractHeaders = (test: TestType) => {
    const headers: { name: string; value: string }[] = [];
    test.rules.forEach((rule) => {
      if (rule.type === "header") {
        headers.push({ name: rule.targetPath, value: rule.expectedValue });
      }
    });
    setHeaders(headers);
  };

  React.useEffect(() => {
    if (!testSuiteId || !testId) {
      return;
    }
    BackendAxios.get<TestType>(
      `/test-suites/${testSuiteId}/tests/${testId}`
    ).then((res) => {
      setTest(res.data);
      extractStatusCode(res.data);
      extractBody(res.data);
      extractHeaders(res.data);
    });
  }, [testSuiteId, testId]);

  const handleChange = (_: any, newValue: string) => {
    setValue(newValue);
  };

  const hadnleSave = () => {
    // TODO: Save the test suite
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <span className="text-white text-xl font-bold">{test?.name}</span>
        <CiSaveDown2
          className="text-blue-400 text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
          onClick={hadnleSave}
        />
      </div>
      <SelectComponent
        options={[
          { value: "200", label: "200" },
          { value: "201", label: "201" },
          { value: "404", label: "404" },
        ]}
        title="Status Code"
        value={statusCode?.toString() || ""}
        setValue={(value: string) => setStatusCode(value)}
      />
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Body" value="1" />
          <Tab label="Headers" value="2" />
        </TabList>
        <TabPanel value="1" style={{ padding: 0, paddingTop: 16 }}>
          <BodySection body={body} />
        </TabPanel>
        <TabPanel value="2" style={{ padding: 0, paddingTop: 16 }}>
          <HeaderSection headers={headers} />
        </TabPanel>
      </TabContext>
    </>
  );
};
