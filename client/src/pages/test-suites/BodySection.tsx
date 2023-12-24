import Editor from "@monaco-editor/react";

type BodySectionProps = {
  body: any;
  language?: string;
  onBodyChange?: (body: any) => void;
};

export const BodySection = ({
  body,
  language,
  onBodyChange,
}: BodySectionProps) => {
  const onChangeBodyValue = (value: any) => {
    try {
      onBodyChange?.(value);
    } catch (error) {}
  };
  const type =
    language ?? (typeof body === "string" && body.includes("html"))
      ? "html"
      : "json";

  return (
    <div className="flex flex-col space-y-4 w-full">
      <Editor
        width="100%"
        className="min-h-[50vh]"
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
