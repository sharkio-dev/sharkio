import * as React from "react";
import Editor from "@monaco-editor/react";
import { SelectComponent } from "./SelectComponent";

export const BodySection = () => {
  const [body, setBody] = React.useState();

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row w-1/4">
        <SelectComponent
          options={[
            { value: "inline", label: "Inline" },
            { value: "rule", label: "Rules" },
          ]}
          title="Test Type"
        />
      </div>
      <Editor
        height="50vh"
        width={"100%"}
        theme="vs-dark"
        defaultLanguage="json"
        value={body}
        onChange={(value) => setBody(value)}
      />
    </div>
  );
};