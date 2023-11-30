import TabPanel from "@mui/lab/TabPanel";
import { BodySection } from "./BodySection";
import { HeaderSection } from "./HeaderSection";
import { TextField } from "@mui/material";
import { TestType, useTestStore } from "../../stores/testStore";
import { SelectComponent } from "./SelectComponent";
import { useState } from "react";
import TestButtonSection from "./TestButtonSection";

interface RequestModalProps {
  onTestChange: (test: TestType) => void;
  onTestMethodChange: (test: TestType) => void;
  onRequestHeadersChange: (rules: any[]) => void;
  requestHeaders: any[];
}
const RequestModal = ({
  onTestChange,
  onTestMethodChange,
  onRequestHeadersChange,
  requestHeaders,
}: RequestModalProps) => {
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
            <SelectComponent
              options={[
                { value: "GET", label: "GET" },
                { value: "POST", label: "POST" },
                { value: "PUT", label: "PUT" },
                { value: "PATCH", label: "PATCH" },
                { value: "DELETE", label: "DELETE" },
              ]}
              title="Method"
              value={currentTest.method}
              setValue={(value) => {
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
              onTestChange({ ...currentTest, url: e.target.value });
            }}
          />
        </div>
        <TestButtonSection changePart={setRequestPart} partName={requestPart} />
        {requestPart === "Headers" && (
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
                (_, i) => i !== index
              );
              onRequestHeadersChange(removedHeaders);
            }}
          />
        )}
        {requestPart === "Body" && (
          <BodySection
            body={currentTest.body}
            onBodyChange={(val) => onTestChange({ ...currentTest, body: val })}
          />
        )}
      </div>
    </TabPanel>
  );
};

export default RequestModal;
