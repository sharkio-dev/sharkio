import Editor from "@monaco-editor/react";

type BodySectionProps = {
  body: string;
  setBody?: (body: string) => void;
};

export const BodySection = ({ body, setBody }: BodySectionProps) => {
  return (
    <div className="flex flex-col space-y-4 w-full">
      <Editor
        height="50vh"
        width={"100%"}
        theme="vs-dark"
        defaultLanguage="json"
        value={body}
        language={
          typeof body === "string" && body.includes("html") ? "html" : "json"
        }
        onChange={(value, _) => setBody && setBody(value || "")}
        options={{
          readOnly: !setBody,
          minimap: {
            enabled: false,
          },
        }}
      />
    </div>
  );
};
