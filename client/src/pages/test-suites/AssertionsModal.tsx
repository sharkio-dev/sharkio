import TabPanel from "@mui/lab/TabPanel";
import { BodySection } from "./BodySection";
import { HeaderSection } from "./HeaderSection";
import StatusCodeSelector from "./StatusCodeSelector";
import { Rule,useTestStore } from "../../stores/testStore";
import { useState } from "react";
import TestButtonSection from "./TestButtonSection";

interface AssertionsModalProps {
  onStatusCodeChange: (statusCode: string) => void;
  onBodyChange: (body: string) => void;
  onAssertionHeadersChange: (rules: Rule[]) => void;
  tabNumber: string;
}

const AssertionsModal: React.FC<AssertionsModalProps> = ({
  onStatusCodeChange,
  onBodyChange,
  onAssertionHeadersChange,
  tabNumber,
}) => {
  const [AssertionPart, setAssertionPart] = useState<string>("Status");
  const statusCode = useTestStore((s) =>
    s.currentTest.rules.find((rule) => rule.type === "status_code")
  );
  const body = useTestStore((s) =>
    s.currentTest.rules.find((rule) => rule.type === "body")
  );
  const headers = useTestStore((s) =>
    s.currentTest.rules.filter((rule) => rule.type === "header")
  );

  const onChangeHeader = (index: number, value: any, targetPath: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = {
      ...newHeaders[index],
      targetPath: targetPath,
      expectedValue: value,
    };
    onAssertionHeadersChange(newHeaders);
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
            value={statusCode?.expectedValue.toString() || ""}
            setValue={onStatusCodeChange}
          />
        </div>
      )}
      {AssertionPart === "Headers" && (
        <HeaderSection
          headers={headers.map((rule) => ({
            name: (rule.targetPath as string) || "",
            value: rule.expectedValue,
          }))}
          setHeaders={onChangeHeader}
          addHeader={() => {
            onAssertionHeadersChange([
              ...headers,
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
            onAssertionHeadersChange(headers.filter((_, i) => i !== index))
          }
        />
      )}
      {AssertionPart === "Body" && (
        <BodySection body={body?.expectedValue} onBodyChange={onBodyChange} />
      )}
    </TabPanel>
  );
};

export default AssertionsModal;
