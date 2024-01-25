import Editor from "@monaco-editor/react";
import React, { useState } from "react";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { SelectComponent } from "../../components/select-component/SelectComponent";
import { MdOutlineCopyAll } from "react-icons/md";
import { Button, Modal, Paper, Tooltip } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
import { MdChevronRight } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { RxMagicWand } from "react-icons/rx";
import { faker } from "@faker-js/faker";
import { PiRepeat } from "react-icons/pi";

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
        <div className="flex justify-between items-center">
          <div className="flex items-center">
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
            <div className="flex w-28 ml-2">
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

interface WizardProps {
  handleSelection: (text: string) => void;
  open: boolean;
  onClose: () => void;
}

const Wizard: React.FC<WizardProps> = ({ handleSelection, open, onClose }) => {
  return (
    <Modal
      open={open}
      className="flex justify-center items-center border-0"
      onClose={onClose}
    >
      <Paper className="flex flex-col w-96 rounded-sm outline-none p-4">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center space-x-2">
            <RxMagicWand className="text-xl text-magic" />
            <div className="text-lg">Dynamic Data</div>
          </div>
          <MdOutlineCancel
            className="text-xl cursor-pointer active:scale-95 transition-all hover:text-magic"
            onClick={onClose}
          />
        </div>
        <div className="w-full border-b-[0.05px] my-4" />
        {/* <MainWizard /> */}
        <FakeDataWizard
          handleSelection={(text) => {
            console.log(text);
            handleSelection(text);
            onClose();
          }}
        />
      </Paper>
    </Modal>
  );
};

interface WizardItemProp {
  title: string;
  onClick?: () => void;
}

const WizardItem: React.FC<WizardItemProp> = ({ title, onClick }) => {
  return (
    <div
      className="flex flex-row w-full items-center justify-between cursor-pointer hover:text-magic shadow-lg rounded-md border-border-color border p-2 active:bg-border-color"
      onClick={onClick}
    >
      <div className="text-lg ">{title}</div>
      <div className="flex items-center space-x-2">
        <MdChevronRight className="text-xl hover:scale-95 cursor-pointer" />
      </div>
    </div>
  );
};

const MainWizard = () => {
  return (
    <div className="flex flex-col space-y-2">
      <WizardItem title="Fake Data" />
      <WizardItem title="Inject Request" />
      <WizardItem title="Inject Response" />
    </div>
  );
};

interface FakeDataWizardProps {
  handleSelection: (text: string) => void;
}

const FakeDataWizard: React.FC<FakeDataWizardProps> = ({ handleSelection }) => {
  const initEntries = () => {
    return Object.entries(faker).filter(
      ([key, _]) => !key.startsWith("_") && !key.startsWith("faker"),
    );
  };
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>(initEntries());
  const [subEntries, setSubEntries] = useState<any[]>([]);

  const onEntryClick = (key: string, value: any = null) => {
    if (value) {
      setSubEntries(
        Object.entries(value).filter(
          ([key, _]) => !key.startsWith("_") && !key.startsWith("faker"),
        ),
      );
      setSelectedEntry(key);
    } else {
      setEntries(initEntries());
      setSelectedEntry(null);
    }
  };

  const onSubEntryClick = (key: string) => {
    debugger;
    handleSelection(`{{faker "${selectedEntry}.${key}"}}`);
    setSelectedEntry(null);
    setSubEntries(initEntries());
  };

  return (
    <div className="flex flex-col space-y-2 max-h-[300px] overflow-y-auto">
      {subEntries.length === 0 &&
        entries.map(([key, value]) => (
          <WizardItem
            key={key}
            title={key}
            onClick={() => {
              onEntryClick(key, value);
            }}
          />
        ))}
      {subEntries.length > 0 &&
        subEntries.map(([key, _]) => (
          <WizardItem
            key={key}
            title={key}
            onClick={() => {
              onSubEntryClick(key);
            }}
          />
        ))}
    </div>
  );
};
