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
import { BodySection } from "../test-suites/BodySection";
import { HeaderSection } from "../test-suites/HeaderSection";
import StatusCodeSelector from "../test-suites/StatusCodeSelector";
import { EndpointType, InvocationType } from "./types";

type InvocationDetailsProps = {
  showResponseTab: boolean;
  invocation: InvocationType | EndpointType | undefined;
  setInvocation: (invocation: InvocationType | EndpointType) => void;
};

const defaultCodeLanguage = "bash";

export function InvocationDetails({
  showResponseTab,
  invocation,
  setInvocation,
}: InvocationDetailsProps & { defaultTab?: string }) {
  const [value, setValue] = React.useState("1");
  const snackbar = useSnackbar();
  const [section, setSection] = React.useState<"Status" | "Body" | "Headers">(
    "Status"
  );

  const handleChange = (_: any, newValue: string) => {
    setValue(newValue);
  };

  const responseData = (response: any) => {
    const data = {
      body: response?.body,
      headers: response?.headers,
      status: response?.status ?? undefined,
    };

    return data;
  };

  const handleBodyChange = (body: string) => {
    if (invocation) {
      setInvocation({
        ...invocation,
        body,
      });
    }
  };

  const onHeadersChange = (headers: { name: string; value: any }[]) => {
    if (invocation) {
      setInvocation({
        ...invocation,
        headers: headers.reduce((acc, header) => {
          acc[header.name] = header.value;
          return acc;
        }, {} as { [key: string]: any }),
      });
    }
  };

  const [codeLanguage, setCodeLanguage] = React.useState(defaultCodeLanguage);
  const languageCodeText = React.useMemo(() => {
    return invocation
      ? generateApiRequestSnippet(codeLanguage, invocation)
      : "";
  }, [invocation, codeLanguage]);

  return (
    <div className="flex flex-col w-full overflow-y-auto">
      <TabContext value={value}>
        <div className="flex flex-row items-center justify-between border-b border-border-color">
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Body" value="1" />
            <Tab label="Headers" value="2" />
            {showResponseTab && <Tab label="Response" value="3" />}
            <Tab label="Code" value="4" />
          </TabList>
        </div>
        <TabPanel
          value="1"
          style={{ padding: 0, paddingTop: 16, overflowY: "auto" }}
        >
          <BodySection
            body={invocation?.body}
            onBodyChange={handleBodyChange}
          />
        </TabPanel>
        <TabPanel
          value="2"
          style={{ padding: 0, paddingTop: 16, overflowY: "auto" }}
        >
          <div className="flex flex-col w-full p-2 rounded-md overflow-y-auto">
            <HeaderSection
              headers={
                invocation?.headers
                  ? Object.keys(invocation?.headers).map((key) => ({
                      name: key,
                      value: invocation?.headers[key],
                    }))
                  : []
              }
              addHeader={() => {
                onHeadersChange([
                  ...(invocation?.headers
                    ? Object.keys(invocation?.headers).map((key) => ({
                        name: key,
                        value: invocation?.headers[key],
                      }))
                    : []),
                  { name: "", value: "" },
                ]);
              }}
              deleteHeader={(index) => {
                const headerName =
                  invocation?.headers &&
                  Object.keys(invocation?.headers)[index];
                if (headerName) {
                  const newHeaders = { ...invocation?.headers };
                  delete newHeaders[headerName];
                  onHeadersChange(
                    Object.keys(newHeaders).map((key) => ({
                      name: key,
                      value: invocation?.headers[key],
                    }))
                  );
                }
              }}
              setHeaders={() => {
                // TODO: implement
                // onHeadersChange();
              }}
            />
          </div>
        </TabPanel>
        {showResponseTab && (
          <TabPanel value="3" style={{ padding: 0, paddingTop: 16 }}>
            <div className="flex flex-col h-full p-2 rounded-md overflow-y-auto">
              <ToggleButtonGroup
                color="primary"
                exclusive
                onChange={(_, value) => setSection(value)}
                className="flex flex-row w-full items-center justify-center mb-8"
                value={section}
              >
                <ToggleButton value="Status" className="w-24 h-6">
                  Status
                </ToggleButton>
                <ToggleButton value="Body" className="w-24 h-6">
                  Body
                </ToggleButton>
                <ToggleButton value="Headers" className="w-24 h-6">
                  {" "}
                  Headers
                </ToggleButton>
              </ToggleButtonGroup>
              {section === "Status" && (
                <>
                  <StatusCodeSelector
                    isDisabled={true}
                    value={responseData(invocation?.response).status}
                  />
                </>
              )}
              {section === "Body" && (
                <BodySection body={responseData(invocation?.response).body} />
              )}
              {section === "Headers" && (
                <HeaderSection
                  headers={Object.entries(
                    responseData(invocation?.response).headers || {}
                  ).map(([key, value]) => ({
                    name: key,
                    value,
                  }))}
                />
              )}
            </div>
          </TabPanel>
        )}
        <TabPanel
          value="4"
          style={{ padding: 0, paddingTop: 16 }}
          className="space-y-4"
        >
          <div className="flex">
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
          <BodySection language={codeLanguage} body={languageCodeText} />
        </TabPanel>
      </TabContext>
      {snackbar.component}
    </div>
  );
}
