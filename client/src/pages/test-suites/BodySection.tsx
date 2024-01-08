import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  const params = useParams();
  const [invocationId, setInvoationId] = useState(params.invocationId);
  const [editor, setEditor] = useState<any>(null);
  useEffect(() => {
    if (editor && invocationId !== params.invocationId) {
      editor.trigger("anyString", "editor.action.formatDocument", {});
      setInvoationId(invocationId);
    }
  }, [editor, invocationId, params.invocationId, body]);

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
    <div className="flex w-full flex-col space-y-4">
      <Editor
        width="100%"
        theme="vs-dark"
        className="min-h-[40vh]"
        defaultLanguage="handlebars"
        value={body}
        language={type}
        onMount={(editor) => {
          setEditor(editor);
        }}
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
