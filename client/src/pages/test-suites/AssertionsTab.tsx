import TabPanel from "@mui/lab/TabPanel";
import { BodySection } from "./BodySection";
import { HeaderSection } from "./HeaderSection";
import StatusCodeSelector from "./StatusCodeSelector";
import { Rule, TestType, useTestStore } from "../../stores/testStore";
import { useState } from "react";
import TestButtonSection from "./TestButtonSection";

interface AssertionsTabProps {
  onDataSave: (test: TestType) => void;
  onDebounceSave: (test: TestType) => void;
  tabNumber: string;
}

const AssertionsTab: React.FC<AssertionsTabProps> = ({
  onDataSave,
  onDebounceSave,
  tabNumber,
}) => {
  const currentTest = useTestStore((s) => s.currentTest);
  const [AssertionPart, setAssertionPart] = useState<string>("Status");
  const getRule = useTestStore((s) => s.getRuleFromCurrentTest);
  const statusCodeRule = getRule("status_code") || {
    type: "status_code",
    expectedValue: "200",
    comparator: "equals",
  };
  const bodyRule = getRule("body") || {
    type: "body",
    expectedValue: "",
    comparator: "equals",
  };
  const headerRules = useTestStore((s) =>
    s.currentTest.rules.filter((rule) => rule.type === "header"),
  );

  const onChangeHeader = (index: number, value: any, targetPath: string) => {
    const newHeaders = [...headerRules];
    newHeaders[index] = {
      ...newHeaders[index],
      targetPath: targetPath,
      expectedValue: value,
    };
    handleHeadersChange(newHeaders);
  };

  const handleHeadersChange = (newHeaders: Rule[]) => {
    onDebounceSave({
      ...currentTest,
      rules: [statusCodeRule, bodyRule, ...newHeaders],
    });
  };

  const handleBodyChange = (newBody: string) => {
    onDebounceSave({
      ...currentTest,
      rules: [
        statusCodeRule,
        { ...bodyRule, expectedValue: newBody },
        ...headerRules,
      ],
    });
  };
  const handleStatusCodeChange = (newStatusCode: string) => {
    onDataSave({
      ...currentTest,
      rules: [
        { ...statusCodeRule, expectedValue: newStatusCode },
        bodyRule,
        ...headerRules,
      ],
    });
  };

  return (
    <TabPanel value="1" style={{ padding: 0, paddingTop: 0 }}>
      <TestButtonSection
        changePart={setAssertionPart}
        partName={AssertionPart}
        tabNumber={tabNumber}
      />
      {AssertionPart === "Status" && (
        <div className="flex flex-row w-full">
          <StatusCodeSelector
            value={statusCodeRule?.expectedValue.toString() || ""}
            setValue={handleStatusCodeChange}
          />
        </div>
      )}
      {AssertionPart === "Headers" && (
        <HeaderSection
          headers={headerRules.map((rule) => ({
            name: (rule.targetPath as string) || "",
            value: rule.expectedValue,
          }))}
          setHeaders={onChangeHeader}
          addHeader={() => {
            handleHeadersChange([
              ...headerRules,
              {
                type: "header",
                expectedValue: "",
                targetPath: "",
                comparator: "equals",
              },
            ]);
          }}
          deleteHeader={(index) =>
            handleHeadersChange(headerRules.filter((_, i) => i !== index))
          }
        />
      )}
      {AssertionPart === "Body" && (
        <BodySection
          body={bodyRule?.expectedValue}
          onBodyChange={handleBodyChange}
        />
      )}
    </TabPanel>
  );
};

export default AssertionsTab;
