import Editor from "@monaco-editor/react";
import { useState } from "react";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { SelectComponent } from "../../components/select-component/SelectComponent";
import { MdOutlineCopyAll } from "react-icons/md";
import { Button, Tooltip } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
import { RxMagicWand } from "react-icons/rx";
import { PiRepeat } from "react-icons/pi";
import { Wizard } from "../../components/wizard/Wizard";

type BodySectionProps = {
  body: any;
  language?: string;
  onBodyChange?: (body: any) => void;
  showButtons?: boolean;
  isReadOnly?: boolean;
};

export const BodySection = ({
  body,
  language = "json",
  onBodyChange,
  showButtons = true,
  isReadOnly = false,
}: BodySectionProps) => {
  const [type, setType] = useState(language);
  const [editor, setEditor] = useState<any>(null);
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [wizardOpen, setWizardOpen] = useState(false);

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

  const insertText = (text: string) => {
    if (!editor) return;
    const selection = editor.getSelection();
    const id = { major: 1, minor: 1 };
    const op = {
      identifier: id,
      range: selection,
      text: text,
      forceMoveMarkers: true,
    };
    editor.executeEdits("my-source", [op]);
  };

  const repeatSelectedText = () => {
    if (!editor) return;
    const selection = editor.getSelection();
    const text = editor.getModel().getValueInRange(selection);
    insertText(`{{#repeat 10}}${text}{{/repeat}}`);
  };

  return (
    <div className="flex flex-col h-full w-full">
      {snackBar}
      {showButtons && (
        <div className="flex justify-between items-center  bg-secondary pb-2">
          <div className="flex justify-between items-center border-border-color border-b-[0.1px] w-full bg-secondary pb-1 px-2">
            <div className="flex items-center">
              <div className="flex w-28 ml-2">
                <SelectComponent
                  options={[
                    { label: "Handlebars", value: "handlebars" },
                    { label: "Json", value: "json" },
                    { label: "Yaml", value: "yaml" },
                    { label: "Xml", value: "xml" },
                    { label: "Text", value: "text" },
                    { label: "Html", value: "html" },
                  ]}
                  value={type}
                  setValue={setType}
                  variant="standard"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="text" onClick={beautify}>
                Beautify
              </Button>
              {isReadOnly && (
                <>
                  <Button
                    variant="text"
                    sx={{ minWidth: 0, borderRadius: "50%" }}
                    onClick={repeatSelectedText}
                  >
                    <Tooltip title="Repeat Selected Text" placement="top">
                      <div className="h-4 w-4 items-center justify-center">
                        <PiRepeat className="text-lg" />
                      </div>
                    </Tooltip>
                  </Button>
                  <Button
                    variant="text"
                    color="secondary"
                    sx={{ minWidth: 0, borderRadius: "50%" }}
                    onClick={() => setWizardOpen(true)}
                  >
                    <Tooltip title="Generate Data" placement="top">
                      <div className="h-4 w-4 items-center justify-center">
                        <RxMagicWand className="text-lg" />
                      </div>
                    </Tooltip>
                  </Button>
                  <Wizard
                    handleSelection={insertText}
                    open={wizardOpen}
                    onClose={() => setWizardOpen(false)}
                  />
                </>
              )}
              <MdOutlineCopyAll
                className="text-2xl cursor-pointer"
                onClick={copyToClipboard}
              />
            </div>
          </div>
        </div>
      )}
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
          formatOnPaste: true,
          minimap: {
            enabled: false,
          },
        }}
      />
    </div>
  );
};
