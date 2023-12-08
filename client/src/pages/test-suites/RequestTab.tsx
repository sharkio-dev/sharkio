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
  requestHeaders: { name: string; value: string }[];
  setRequestHeaders: React.Dispatch<
    React.SetStateAction<{ name: string; value: string }[]>
  >;
}
const RequestTab = ({
  onDebounceSave,
  onTestMethodChange,
  requestHeaders,
  setRequestHeaders,
}: RequestTabProps) => {
  const currentTest = useTestStore((s) => s.currentTest);
  const [requestPart, setRequestPart] = useState<string>("Body");

  const handleHeaderChange = (
    index: number,
    value: any,
    targetPath: string,
  ) => {
    const headersReq = [...requestHeaders];
    headersReq[index] = {
      ...headersReq[index],
      name: targetPath,
      value: value,
    };
    handleReduceHeaders(headersReq);
  };

  const handleReduceHeaders = (headersReq: any[]) => {
    setRequestHeaders(headersReq);
    const reduceHeaders = headersReq.reduce((acc, h) => {
      acc[h.name] = h.value;
      return acc;
    }, {} as any);
    onDebounceSave({
      ...currentTest,
      headers: reduceHeaders,
    });
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
              onDebounceSave({ ...currentTest, url: e.target.value });
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
            setHeaders={handleHeaderChange}
            addHeader={() => {
              const newHeader = {
                name: "",
                value: "",
              };
              handleReduceHeaders([...requestHeaders, newHeader]);
            }}
            deleteHeader={(index) => {
              const removedHeaders = requestHeaders.filter(
                (_, i) => i !== index,
              );
              handleReduceHeaders(removedHeaders);
            }}
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
