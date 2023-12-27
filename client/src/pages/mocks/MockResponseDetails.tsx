import React from "react";
import { BodySection } from "../test-suites/BodySection";
import { HeaderSection } from "../test-suites/HeaderSection";
import { MockResponse } from "../../stores/mockStore";
import { BodyHeaderToggle } from "./BodyHeaderStatusToggle";
import StatusCodeSelector from "../test-suites/StatusCodeSelector";

interface MockResponseDetailsProps {
  response: MockResponse;
  handleResponseChange: (value: MockResponse) => void;
}
export const MockResponseDetails: React.FC<MockResponseDetailsProps> = ({
  response,
  handleResponseChange,
}) => {
  const [section, setSection] = React.useState<"Status" | "Body" | "Headers">(
    "Body",
  );

  return (
    <div className="flex flex-col h-full py-2 rounded-md overflow-y-auto">
      <BodyHeaderToggle
        value={section}
        setValue={(value: string) => setSection(value as any)}
      />
      {section === "Body" && (
        <div className="flex flex-col items-center space-y-4">
          <StatusCodeSelector
            value={response.status.toString() || ""}
            setValue={(value) => {
              handleResponseChange({ ...response, status: +value });
            }}
          />
          <BodySection
            body={response.body || ""}
            onBodyChange={(value: any) => {
              handleResponseChange({ ...response, body: value });
            }}
          />
        </div>
      )}

      {section === "Headers" && (
        <HeaderSection
          headers={response.headers || {}}
          handleHeadersChange={(headers: object) => {
            handleResponseChange({ ...response, headers });
          }}
        />
      )}
    </div>
  );
};