import Editor from "@monaco-editor/react";
import { useState } from "react";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { SelectComponent } from "../../components/select-component/SelectComponent";
import { MdOutlineCopyAll } from "react-icons/md";
import { Button } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";

type BodySectionProps = {
  body: any;
  language?: string;
  onBodyChange?: (body: any) => void;
  showButtons?: boolean;
};

export const BodySection = ({
  body,
  language,
  onBodyChange,
  showButtons = true,
}: BodySectionProps) => {
  const [type, setType] = useState("handlebars");
  const [editor, setEditor] = useState<any>(null);
  const { show: showSnackbar, component: snackBar } = useSnackbar();

  const onChangeBodyValue = (value: any) => {
    try {
      onBodyChange?.(value);
    } catch (error) {}
  };

  const beautify = () => {
    if (!editor) return;
    editor.trigger("anyString", "editor.action.formatDocument", "");
  };

  const copyToClipboard = () => {
    if (!editor) return;
    navigator.clipboard.writeText(editor.getValue());
    showSnackbar("Copied to clipboard", "success");
  };

  return (
    <div className="flex flex-col h-full w-full">
      {snackBar}
      {showButtons && (
        <div className="flex justify-between items-center">
          <div className="flex w-28">
            <SelectComponent
              options={[
                { label: "Handlebars", value: "handlebars" },
                { label: "Json", value: "json" },
                { label: "Xml", value: "xml" },
                { label: "Text", value: "text" },
                { label: "Html", value: "html" },
              ]}
              value={type}
              setValue={setType}
              variant="standard"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="text" onClick={beautify}>
              Beautify
            </Button>
            <MdOutlineCopyAll
              className="text-2xl cursor-pointer"
              onClick={copyToClipboard}
            />
          </div>
        </div>
      )}
      <Editor
        width="100%"
        theme="vs-dark"
        className="h-[50vh]"
        value={body}
        loading={<LoadingIcon />}
        language={language || type}
        onMount={(editor) => {
          setEditor(editor);
        }}
        onChange={(value) => onChangeBodyValue(value)}
        options={{
          formatOnPaste: true,
          readOnly: !onBodyChange,
          minimap: {
            enabled: false,
          },
        }}
      />
    </div>
  );
};
