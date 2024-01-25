import TabPanel from "@mui/lab/TabPanel";
import { BodySection } from "./BodySection";
import { HeaderSection } from "./HeaderSection";
import { TextField } from "@mui/material";
import { TestType, useTestStore } from "../../stores/testStore";
import { useState } from "react";
import TestButtonSection from "./TestButtonSection";
import { SelectMethodDropDown } from "../mocks/SelectMethodDropDown";

interface RequestTabProps {
  onDebounceSave: (test: TestType) => void;
  onTestMethodChange: (test: TestType) => void;
}
const RequestTab = ({
  onDebounceSave,
  onTestMethodChange,
}: RequestTabProps) => {
  const currentTest = useTestStore((s) => s.currentTest);
  const [requestPart, setRequestPart] = useState<string>("Body");

  return (
    <TabPanel value="2" style={{ padding: 0, paddingTop: 16, height: "100%" }}>
      <div className="flex h-full flex-col space-y-4">
        <div className="flex flex-row space-x-4">
          <div className="flex flex-row w-40">
            <SelectMethodDropDown
              value={currentTest.method}
              onChange={(value: string) => {
                onTestMethodChange({ ...currentTest, method: value });
              }}
            />
          </div>
          <TextField
            label="URL"
            variant="outlined"
            size="small"
            className="w-full"
            value={currentTest.url}
            onChange={(e) => {
              onDebounceSave({ ...currentTest, url: e.target.value });
            }}
          />
        </div>
        <TestButtonSection changePart={setRequestPart} partName={requestPart} />
        {requestPart === "Headers" && (
          <HeaderSection
            headers={currentTest.headers}
            handleHeadersChange={(headersReq: { [key: string]: any }) =>
              onDebounceSave({ ...currentTest, headers: headersReq })
            }
          />
        )}
        {requestPart === "Body" && (
          <BodySection
            body={currentTest.body}
            onBodyChange={(val) =>
              onDebounceSave({ ...currentTest, body: val })
            }
          />
        )}
      </div>
    </TabPanel>
  );
};

export default RequestTab;
