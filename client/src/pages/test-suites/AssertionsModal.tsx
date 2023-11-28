import TabPanel from "@mui/lab/TabPanel";
import { BodySection } from "./BodySection";
import { HeaderSection } from "./HeaderSection";
import StatusCodeSelector from "./StatusCodeSelector";
import { Rule } from "../../stores/testStore";
import { useState } from "react";
import TestButtonSection from "./TestButtonSection";

interface AssertionsModalProps {
  statusCodeRule: Rule;
  onStatusCodeChange: (statusCode: string) => void;
  bodyRule: Rule;
  onBodyChange: (body: string) => void;
  headerRules: Rule[];
  onAssertionHeadersChange: (rules: Rule[]) => void;
  tabNumber: string;
}

const AssertionsModal: React.FC<AssertionsModalProps> = ({
  statusCodeRule,
  onStatusCodeChange,
  bodyRule,
  onBodyChange,
  headerRules,
  onAssertionHeadersChange,
  tabNumber,
}) => {
  const [AssertionPart, setAssertionPart] = useState<string>("Status");

  const onChangeHeader = (index: number, value: any, targetPath: string) => {
    const headers = [...headerRules];
    headers[index] = {
      ...headers[index],
      targetPath: targetPath,
      expectedValue: value,
    };
    onAssertionHeadersChange(headers);
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
            value={statusCodeRule.expectedValue?.toString() || ""}
            setValue={onStatusCodeChange}
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
            onAssertionHeadersChange([
              ...headerRules,
              {
                type: "header",
                expectedValue: "",
                targetPath: "",
                comparator: "equals",
              },
            ]);
            console.log("assertions headers");
          }}
          deleteHeader={(index) =>
            onAssertionHeadersChange(headerRules.filter((_, i) => i !== index))
          }
        />
      )}
      {AssertionPart === "Body" && (
        <BodySection
          body={bodyRule.expectedValue}
          onChangeBody={onBodyChange}
        />
      )}
    </TabPanel>
  );
};

export default AssertionsModal;
