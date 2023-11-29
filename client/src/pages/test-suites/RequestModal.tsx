import TabPanel from "@mui/lab/TabPanel";
import { BodySection } from "./BodySection";
import { HeaderSection } from "./HeaderSection";
import { TextField } from "@mui/material";
import { TestType } from "../../stores/testStore";
import { SelectComponent } from "./SelectComponent";
import { useEffect, useState } from "react";
import TestButtonSection from "./TestButtonSection";

interface RequestModalProps {
  test: TestType;
  onTestChange: (test: TestType) => void;
  onTestMethodChange: (test: TestType) => void;
  onRequestHeadersChange: (rules: any[]) => void;
}
const RequestModal = ({
  test,
  onTestChange,
  onTestMethodChange,
  onRequestHeadersChange,
}: RequestModalProps) => {
  const [requestPart, setRequestPart] = useState<string>("Body");
  const [requestHeaders, setRequestHeaders] = useState<any[]>([]);

  useEffect(() => {
    if (!test?.headers) {
      setRequestHeaders([]);
      return;
    }
    setRequestHeaders(
      Object.entries(test?.headers || []).map((h: any) => ({
        name: h[0],
        value: h[1],
      })),
    );
  }, []);

  const onHeaderChange = (index: number, value: any, targetPath: string) => {
    const headers = [...requestHeaders];
    headers[index] = {
      ...headers[index],
      name: targetPath,
      value: value,
    };
    ReduceHeaders(headers);
  };

  const ReduceHeaders = (headers: any[]) => {
    setRequestHeaders(headers);
    const newHeaders = headers.reduce((acc, h) => {
      acc[h.name] = h.value;
      return acc;
    }, {} as any);
    onRequestHeadersChange(newHeaders);
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
              value={test.method}
              setValue={(value) => {
                onTestMethodChange({ ...test, method: value });
              }}
            />
          </div>
          <TextField
            label="URL"
            variant="outlined"
            size="small"
            className="w-full"
            value={test.url}
            onChange={(e) => {
              onTestChange({ ...test, url: e.target.value });
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
              ReduceHeaders([...requestHeaders, newHeader]);
            }}
            deleteHeader={(index) => {
              const removedHeaders = requestHeaders.filter(
                (_, i) => i !== index,
              );
              ReduceHeaders(removedHeaders);
            }}
          />
        )}
        {requestPart === "Body" && (
          <BodySection
            body={test.body}
            onBodyChange={(val) => onTestChange({ ...test, body: val })}
          />
        )}
      </div>
    </TabPanel>
  );
};

export default RequestModal;
