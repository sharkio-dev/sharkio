import TabPanel from "@mui/lab/TabPanel";
import { BodySection } from "./BodySection";
import { HeaderSection } from "./HeaderSection";
import StatusCodeSelector from "./StatusCodeSelector";
import { Rule, useTestStore } from "../../stores/testStore";
import { useState } from "react";
import TestButtonSection from "./TestButtonSection";
import { AiOutlineInfo } from "react-icons/ai";
import { Button, Tooltip } from "@mui/material";

interface AssertionsTabProps {
  onStatusCodeChange: (statusCode: string) => void;
  onBodyChange: (body: string) => void;
  onAssertionHeadersChange: (rules: Rule[]) => void;
  tabNumber: string;
}

const AssertionsTab: React.FC<AssertionsTabProps> = ({
  onStatusCodeChange,
  onBodyChange,
  onAssertionHeadersChange,
  tabNumber,
}) => {
  const [AssertionPart, setAssertionPart] = useState<string>("Status");
  const getRule = useTestStore((s) => s.getRuleFromCurrentTest);
  const statusCode = getRule("status_code") || {
    type: "status_code",
    expectedValue: "200",
    comparator: "equals",
  };
  const body = getRule("body") || {
    type: "body",
    expectedValue: "",
    comparator: "equals",
  };
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
        <div>
          <div className="flex h-5 mb-2  ">
            <Tooltip title="Invalid JSON will not be saved!">
              <Button
                color="warning"
                variant="outlined"
                size="small"
                className=""
              >
                <AiOutlineInfo className="w-5 h-4 font-bold" />
              </Button>
            </Tooltip>
          </div>
          <BodySection body={body?.expectedValue} onBodyChange={onBodyChange} />
        </div>
      )}
    </TabPanel>
  );
};

export default AssertionsTab;
