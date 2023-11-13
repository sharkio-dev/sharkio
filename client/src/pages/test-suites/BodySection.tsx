import Editor from "@monaco-editor/react";

export const BodySection = ({ body, setBody }) => {
  return (
    <div className="flex flex-col space-y-4">
      <Editor
        height="50vh"
        width={"100%"}
        theme="vs-dark"
        defaultLanguage="json"
        value={body}
        language={body?.includes("html") ? "html" : "json"}
        onChange={(value) => setBody(value)}
      />
    </div>
  );
};
