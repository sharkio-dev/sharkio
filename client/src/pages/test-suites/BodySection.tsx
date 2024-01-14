import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingIcon } from "../sniffers/LoadingIcon";

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
    if (!editor) return;
    editor.trigger("anyString", "editor.action.formatDocument", {});
    setInvoationId(invocationId);
  }, [editor]);

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
    <Editor
      width="100%"
      theme="vs-dark"
      className="h-[50vh]"
      value={body}
      loading={<LoadingIcon />}
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
  );
};
