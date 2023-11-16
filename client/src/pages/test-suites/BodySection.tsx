import Editor from "@monaco-editor/react";
import { Rule } from "../../stores/testStore";

type BodySectionProps = {
  body: Rule;
  setBody: (body: any) => void;
};

export const BodySection = ({ body, setBody }: BodySectionProps) => {
  return (
    <div className="flex flex-col space-y-4 w-full">
      <Editor
        height="50vh"
        width={"100%"}
        theme="vs-dark"
        defaultLanguage="json"
        value={body.expectedValue}
        language={body.expectedValue?.includes("html") ? "html" : "json"}
        onChange={(value) => setBody(value)}
        options={{
          minimap: {
            enabled: false,
          },
        }}
      />
    </div>
  );
};
