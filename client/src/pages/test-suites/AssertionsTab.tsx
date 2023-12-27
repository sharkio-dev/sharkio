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
    s.currentTest.rules.filter((rule) => rule.type === "header")
  );

  const handleHeadersChange = (newHeaders: { [key: string]: any }) => {
    onDebounceSave({
      ...currentTest,
      rules: [
        statusCodeRule,
        bodyRule,
        ...Object.entries(newHeaders).map(
          ([name, value]) =>
            ({
              type: "header",
              targetPath: name,
              expectedValue: value,
              comparator: "equals",
            } as Rule)
        ),
      ],
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
          headers={{
            ...headerRules.reduce(
              (acc, rule) => ({
                ...acc,
                [rule.targetPath as string]: rule.expectedValue,
              }),
              {}
            ),
          }}
          handleHeadersChange={handleHeadersChange}
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
