import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { Rule, TestType } from "../../stores/testStore";
import AssertionsModal from "./AssertionsModal";
import RequestModal from "./RequestModal";
import { useState } from "react";

type TestConfigProps = {
  statusCodeRule: Rule;
  onStatusCodeChange: (statusCode: string) => void;
  bodyRule: Rule;
  onBodyChange: (body: string) => void;
  headerRules: Rule[];
  onAssertionHeadersChange: (rules: Rule[]) => void;
  test: TestType;
  onTestChange: (test: TestType) => void;
  onTestMethodChange: (test: TestType) => void;
  onRequestHeadersChange: (header: Array<[string, string]>) => void;
};
export const TestConfig = ({
  statusCodeRule,
  onStatusCodeChange,
  bodyRule,
  onBodyChange,
  headerRules,
  onAssertionHeadersChange,
  test,
  onTestChange,
  onTestMethodChange,
  onRequestHeadersChange,
}: TestConfigProps) => {
  const [tabNumber, setTabNumber] = useState("1");

  const handleChange = (_: any, newValue: string) => {
    setTabNumber(newValue);
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
      <AssertionsModal
        statusCodeRule={statusCodeRule}
        onStatusCodeChange={onStatusCodeChange}
        bodyRule={bodyRule}
        onBodyChange={onBodyChange}
        headerRules={headerRules}
        onAssertionHeadersChange={onAssertionHeadersChange}
        tabNumber={tabNumber}
      />
      <RequestModal
        test={test}
        onTestChange={onTestChange}
        onTestMethodChange={onTestMethodChange}
        onRequestHeadersChange={onRequestHeadersChange}
      />
    </TabContext>
  );
};
