import Editor from "@monaco-editor/react";
import React, { useState } from "react";
import { LoadingIcon } from "../../pages/sniffers/LoadingIcon";
import { SelectComponent } from "../select-component/SelectComponent";
import { MdOutlineCopyAll } from "react-icons/md";
import { Button, Tooltip } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
import { RxMagicWand } from "react-icons/rx";
import { PiRepeat } from "react-icons/pi";
import { Wizard } from "../wizard/Wizard";

type BodySectionProps = {
  body: any;
  language?: string;
  onBodyChange?: (body: any) => void;
  showButtons?: boolean;
  isReadOnly?: boolean;
  children?: React.ReactNode;
} & WizardButtonProps;

export const BodySection = ({
  body,
  onBodyChange,
  isReadOnly = false,
  showButtons = true,
  language,
  showAi = true,
  showFakeData = true,
  showPreviousSteps = true,
  showTemplates = true,
}: BodySectionProps) => {
  const onChangeBodyValue = (value: any) => {
    try {
      onBodyChange?.(value);
    } catch (error) {}
  };

  return (
    <EditorProvider language={language}>
      <TextEditor
        body={body}
        onBodyChange={onChangeBodyValue}
        isReadOnly={isReadOnly}
        showButtons={showButtons}
        language={language}
        showAi={showAi}
        showFakeData={showFakeData}
        showPreviousSteps={showPreviousSteps}
        showTemplates={showTemplates}
      />
    </EditorProvider>
  );
};

const EditorContext = React.createContext<any>(null);

const EditorProvider = ({
  children,
  language,
}: {
  children: React.ReactNode;
  language?: string;
}) => {
  const [editor, setEditor] = useState<any>(null);
  const [type, setType] = useState(language || "json");

  return (
    <EditorContext.Provider value={{ editor, setEditor, type, setType }}>
      {children}
    </EditorContext.Provider>
  );
};

const TextEditor = ({
  body,
  onBodyChange,
  showButtons,
  isReadOnly = false,
  showAi = true,
  showFakeData = true,
  showPreviousSteps = true,
  showTemplates = true,
}: BodySectionProps & WizardButtonProps) => {
  const { setEditor, type } = React.useContext(EditorContext);

  const onChangeBodyValue = (value: any) => {
    try {
      onBodyChange?.(value);
    } catch (error) {}
  };

  return (
    <div className="flex flex-col h-full w-full">
      {showButtons && (
        <div className="flex justify-between items-center  bg-secondary pb-2">
          <div className="flex justify-between items-center border-border-color border-b-[0.1px] w-full bg-secondary pb-1 px-2">
            <div className="flex items-center">
              <TypeSelector />
            </div>
            <div className="flex items-center space-x-2">
              <BeautifyButton />
              {!isReadOnly && (
                <WizardButton
                  showAi={showAi}
                  showFakeData={showFakeData}
                  showPreviousSteps={showPreviousSteps}
                  showTemplates={showTemplates}
                />
              )}
              <CopyToClipboard />
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

const CopyToClipboard = () => {
  const { editor } = React.useContext(EditorContext);
  const { show: showSnackbar, component: snackBar } = useSnackbar();

  const copyToClipboard = () => {
    if (!editor) return;
    navigator.clipboard.writeText(editor.getValue());
    showSnackbar("Copied to clipboard", "success");
  };

  return (
    <>
      <MdOutlineCopyAll
        className="text-2xl cursor-pointer"
        onClick={copyToClipboard}
      />
      {snackBar}
    </>
  );
};

const BeautifyButton = () => {
  const { editor } = React.useContext(EditorContext);
  const beautify = () => {
    if (!editor) return;
    editor.trigger("anyString", "editor.action.formatDocument", "");
  };

  return (
    <Button variant="text" onClick={beautify}>
      Beautify
    </Button>
  );
};

interface WizardButtonProps {
  showFakeData?: boolean;
  showTemplates?: boolean;
  showPreviousSteps?: boolean;
  showAi?: boolean;
}

const WizardButton: React.FC<WizardButtonProps> = ({
  showAi = true,
  showFakeData = true,
  showPreviousSteps = true,
  showTemplates = true,
}) => {
  const { editor } = React.useContext(EditorContext);
  const [wizardOpen, setWizardOpen] = useState(false);

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
        showAi={showAi}
        showFakeData={showFakeData}
        showPreviousSteps={showPreviousSteps}
        showTemplates={showTemplates}
      />
    </>
  );
};

const TypeSelector = () => {
  const { type, setType } = React.useContext(EditorContext);
  return (
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
  );
};
