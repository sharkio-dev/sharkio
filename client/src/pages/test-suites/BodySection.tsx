import Editor from "@monaco-editor/react";

type BodySectionProps = {
  body: any;
  onChangeBody: (body: any) => void;
};

export const BodySection = ({ body, onChangeBody }: BodySectionProps) => {

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
        onChange={(value, _) => onChangeBody && onChangeBody(value || "")}
        options={{
          readOnly: !onChangeBody,
          minimap: {
            enabled: false,
          },
        }}
      />
    </div>
  );
};
