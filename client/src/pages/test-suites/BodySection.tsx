import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type BodySectionProps = {
  body: any;
  onBodyChange: (body: any) => void;
};

export const BodySection = ({ body, onBodyChange }: BodySectionProps) => {
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
      JSON.parse(value);
      onBodyChange(value);
    } catch (error) {}
  };

  return (
    <div className="flex w-full flex-col space-y-4">
      <Editor
        height="50vh"
        width="100%"
        theme="vs-dark"
        defaultLanguage="json"
        value={body}
        language={
          typeof body === "string" && body.includes("html") ? "html" : "json"
        }
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
