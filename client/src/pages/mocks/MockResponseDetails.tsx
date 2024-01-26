import React from "react";
import { BodySection } from "../test-suites/BodySection";
import { HeaderSection } from "../test-suites/HeaderSection";
import { MockResponse } from "../../stores/mockStore";
import { BodyHeaderToggle } from "./BodyHeaderStatusToggle";
import StatusCodeSelector from "../test-suites/StatusCodeSelector";

interface MockResponseDetailsProps {
  response?: MockResponse;
  handleResponseChange: (value: MockResponse) => void;
}
export const MockResponseDetails: React.FC<MockResponseDetailsProps> = ({
  response,
  handleResponseChange,
}) => {
  const [editedResponse, setEditedResponse] = React.useState<MockResponse>();

  React.useEffect(() => {
    if (response) {
      setEditedResponse(response);
    }
  }, [response]);

  const onResponseChange = (value: MockResponse) => {
    setEditedResponse(value);
    handleResponseChange(value);
  };

  const [section, setSection] = React.useState<"Status" | "Body" | "Headers">(
    "Body",
  );

  return (
    <div className="flex flex-col h-full py-2 rounded-md overflow-y-auto">
      {editedResponse && (
        <>
          <BodyHeaderToggle
            value={section}
            setValue={(value: string) => setSection(value as any)}
          />
          {section === "Body" && (
            <div className="flex flex-col items-center space-y-4">
              <StatusCodeSelector
                value={editedResponse.status.toString() || ""}
                setValue={(value) => {
                  onResponseChange({ ...editedResponse, status: +value });
                }}
              />
              <BodySection
                language="handlebars"
                body={editedResponse.body || ""}
                onBodyChange={(value: any) => {
                  onResponseChange({ ...editedResponse, body: value });
                }}
              />
            </div>
          )}

          {section === "Headers" && (
            <HeaderSection
              headers={editedResponse.headers || {}}
              handleHeadersChange={(headers: object) => {
                onResponseChange({ ...editedResponse, headers });
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
