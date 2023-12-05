import TabPanel from "@mui/lab/TabPanel";
import { BodySection } from "./BodySection";
import { HeaderSection } from "./HeaderSection";
import { Button, TextField, Tooltip } from "@mui/material";
import { TestType, useTestStore } from "../../stores/testStore";
import { useState } from "react";
import TestButtonSection from "./TestButtonSection";
import { AiOutlineInfo } from "react-icons/ai";
import { SelectMethodDropDown } from "../mocks/SelectMethodDropDown";

interface RequestTabProps {
  onDebounceRequestChange: (test: TestType) => void;
  onTestMethodChange: (test: TestType) => void;
  onRequestHeadersChange: (rules: any[]) => void;
  requestHeaders: any[];
}
const RequestTab = ({
  onDebounceRequestChange,
  onTestMethodChange,
  onRequestHeadersChange,
  requestHeaders,
}: RequestTabProps) => {
  const currentTest = useTestStore((s) => s.currentTest);
  const [requestPart, setRequestPart] = useState<string>("Body");

  const onHeaderChange = (index: number, value: any, targetPath: string) => {
    const headers = [...requestHeaders];
    headers[index] = {
      ...headers[index],
      name: targetPath,
      value: value,
    };
    onRequestHeadersChange(headers);
  };

  return (
    <TabPanel value="2" style={{ padding: 0, paddingTop: 16 }}>
      <div className="flex flex-col space-y-4">
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
              onDebounceRequestChange({ ...currentTest, url: e.target.value });
            }}
          />
        </div>
        <TestButtonSection changePart={setRequestPart} partName={requestPart} />
        {requestPart === "Headers" && (
          <div>
            <div className="flex h-5 mb-2  ">
              <Tooltip title="Two headers with the same name will not be saved">
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
            <HeaderSection
              headers={requestHeaders.map((header: any) => ({
                name: header.name,
                value: header.value,
              }))}
              setHeaders={onHeaderChange}
              addHeader={() => {
                const newHeader = {
                  name: "",
                  value: "",
                };
                onRequestHeadersChange([...requestHeaders, newHeader]);
              }}
              deleteHeader={(index) => {
                const removedHeaders = requestHeaders.filter(
                  (_, i) => i !== index,
                );
                onRequestHeadersChange(removedHeaders);
              }}
            />
          </div>
        )}
        {requestPart === "Body" && (
          <BodySection
            body={currentTest.body}
            onBodyChange={(val) =>
              onDebounceRequestChange({ ...currentTest, body: val })
            }
          />
        )}
      </div>
    </TabPanel>
  );
};

export default RequestTab;
