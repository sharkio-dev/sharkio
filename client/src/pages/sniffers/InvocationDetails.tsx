import { ContentCopy } from "@mui/icons-material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import {
  IconButton,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import * as React from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { generateApiRequestSnippet } from "../../lib/jsonSchema";
import { InvocationType } from "./types";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { selectIconByStatus } from "./Invocation";
import { BodySection } from "../test-suites/BodySection";
import { HeaderSection } from "../test-suites/HeaderSection";

type InvocationDetailsProps = {
  invocation: InvocationType;
  setInvocation: (invocation: InvocationType) => void;
};

const defaultCodeLanguage = "bash";

export function InvocationDetails({
  invocation,
  setInvocation,
}: InvocationDetailsProps) {
  return (
    <PanelGroup
      direction={"vertical"}
      className="max-w-[calc(100vw-56px)] min-h-[calc(100vh-184px)] max-h-[calc(100vh-184px)]"
    >
      <Panel defaultSize={50} maxSize={70}>
        <RequestSection
          invocation={invocation}
          setInvocation={(newInvocation) =>
            setInvocation({
              ...invocation,
              ...newInvocation,
            })
          }
        />
      </Panel>
      <div className="relative h-[1px] w-full my-4 hover:bg-blue-300 bg-border-color">
        <PanelResizeHandle
          className={`absolute h-[30px] w-full top-[-15px] `}
        />
      </div>
      <Panel maxSize={70}>
        <ResponseSection response={invocation?.response} />
      </Panel>
    </PanelGroup>
  );
}

export const RequestSection: React.FC<{
  invocation: {
    body: string;
    headers: { [key: string]: string };
    url: string;
    method: string;
  };
  setInvocation?: (invocation: {
    body?: string;
    headers?: { [key: string]: string };
    url?: string;
    method?: string;
  }) => void;
  disabled?: boolean;
}> = ({ invocation, setInvocation, disabled }) => {
  const [value, setValue] = React.useState("1");
  const snackbar = useSnackbar();
  const [codeLanguage, setCodeLanguage] = React.useState(defaultCodeLanguage);

  const handleChange = (_: any, newValue: string) => {
    setValue(newValue);
  };

  const handleBodyChange = (body: string) => {
    if (invocation && setInvocation) {
      setInvocation({
        ...invocation,
        body,
      });
    }
  };

  const onHeadersChange = (headers: { [key: string]: string }) => {
    if (invocation && setInvocation) {
      setInvocation({
        ...invocation,
        headers,
      });
    }
  };

  const languageCodeText = React.useMemo(() => {
    return invocation
      ? generateApiRequestSnippet(codeLanguage, invocation)
      : "";
  }, [invocation, codeLanguage]);

  return (
    <TabContext value={value}>
      <div className="flex flex-row items-center justify-between border-b border-border-color">
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Body" value="1" />
          <Tab label="Headers" value="2" />
          <Tab label="Code" value="3" />
        </TabList>
      </div>
      <TabPanel
        value="1"
        style={{
          padding: 0,
          paddingTop: 16,
          overflowY: "auto",
          height: "calc(100% - 48px)",
        }}
      >
        <BodySection
          body={invocation?.body}
          onBodyChange={handleBodyChange}
          isReadOnly={disabled}
        />
      </TabPanel>
      <TabPanel
        value="2"
        style={{
          padding: 0,
          paddingTop: 16,
          overflowY: "auto",
          height: "calc(100% - 48px)",
          flexDirection: "column",
        }}
      >
        <HeaderSection
          headers={invocation?.headers || {}}
          handleHeadersChange={onHeadersChange}
        />
      </TabPanel>
      <TabPanel
        value="3"
        style={{
          padding: 0,
          paddingTop: 16,
          height: "calc(100% - 48px)",
          overflowY: "auto",
        }}
      >
        <div className="flex flex-row items-center justify-between mb-4">
          <div>
            <Select
              size="small"
              value={codeLanguage}
              onChange={(evt) => setCodeLanguage(evt.target.value)}
            >
              <MenuItem value="bash">curl</MenuItem>
              <MenuItem value="javascript">javascript</MenuItem>
              <MenuItem value="python">python</MenuItem>
              <MenuItem value="java">java</MenuItem>
              <MenuItem value="golang">golang</MenuItem>
              <MenuItem value="php">php</MenuItem>
            </Select>
          </div>
          <div className="ml-auto">
            <IconButton
              onClick={() =>
                navigator.clipboard.writeText(languageCodeText).then(() => {
                  snackbar.show("Copied to clipboard", "success");
                })
              }
            >
              <ContentCopy />
            </IconButton>
          </div>
        </div>
        <BodySection
          language={codeLanguage}
          body={languageCodeText}
          showButtons={false}
        />
      </TabPanel>
    </TabContext>
  );
};

export const ResponseSection = ({
  response,
}: {
  response?: InvocationType["response"];
}) => {
  const [section, setSection] = React.useState<"Body" | "Headers">("Body");

  return (
    <div className="flex flex-col w-full  overflow-y-auto">
      <span className="text-sm font-semibold text-gray-500 self-start">
        Response {selectIconByStatus(response?.status ?? 0)}
      </span>
      <ToggleButtonGroup
        color="primary"
        exclusive
        onChange={(_, value) => setSection(value)}
        className="flex flex-row w-full items-center justify-center mb-8"
        value={section}
      >
        <ToggleButton value="Body" className="w-24 h-6">
          Body
        </ToggleButton>
        <ToggleButton value="Headers" className="w-24 h-6">
          Headers
        </ToggleButton>
      </ToggleButtonGroup>
      {section === "Body" && (
        <BodySection
          body={
            typeof response?.body === "string"
              ? response?.body
              : JSON.stringify(response?.body, null, 2)
          }
        />
      )}
      {section === "Headers" && (
        <HeaderSection headers={response?.headers || {}} />
      )}
    </div>
  );
};
