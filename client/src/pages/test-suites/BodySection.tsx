import Editor from "@monaco-editor/react";

type BodySectionProps = {
  body: any;
  onBodyChange: (body: any) => void;
};

export const BodySection = ({ body, onBodyChange }: BodySectionProps) => {
  const onChangeBodyValue = (value: any) => {
    try {
      const parsedValue = JSON.parse(value);
      onBodyChange(value);
    } catch (error) {
    }
  };

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
