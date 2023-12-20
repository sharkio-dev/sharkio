import Editor from "@monaco-editor/react";

type BodySectionProps = {
  body: any;
  onBodyChange: (body: any) => void;
};

export const BodySection = ({ body, onBodyChange }: BodySectionProps) => {
  const onChangeBodyValue = (value: any) => {
    try {
      onBodyChange(value);
    } catch (error) {}
  };
  const type =
    typeof body === "string" && body.includes("html") ? "html" : "json";

  return (
    <div className="flex flex-col space-y-4 w-full">
      <Editor
        height="50vh"
        width={"100%"}
        theme="vs-dark"
        defaultLanguage="json"
        value={body}
        language={type}
        onChange={(value) => onChangeBodyValue(value)}
        options={{
          readOnly: !onBodyChange,
          minimap: {
            enabled: false,
          },
        }}
      />
    </div>
  );
};
