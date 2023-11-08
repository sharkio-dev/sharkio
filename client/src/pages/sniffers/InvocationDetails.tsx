import Editor from "@monaco-editor/react";
import { ContentCopy } from "@mui/icons-material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { IconButton, MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import * as React from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { generateApiRequestSnippet } from "../../lib/jsonSchema";
import { InvocationType } from "./types";

type InvocationDetailsProps = {
  invocation?: InvocationType;
};

const defaultCodeLanguage = "bash";

export function InvocationDetails({ invocation }: InvocationDetailsProps) {
  const [value, setValue] = React.useState("1");

  const handleChange = (_: any, newValue: string) => {
    setValue(newValue);
  };

  const responseData = (response: any) => {
    const data = {
      body: response?.body ?? {},
      headers: response?.headers ?? {},
      status: response?.status ?? undefined,
    };

    return data;
  };

  const { body, headers } = invocation ?? {};
  const [codeLanguage, setCodeLanguage] = React.useState(defaultCodeLanguage);
  const languageCodeText = React.useMemo(() => {
    return invocation
      ? generateApiRequestSnippet(codeLanguage, invocation)
      : "";
  }, [invocation, codeLanguage]);
  const snackbar = useSnackbar();

  return (
    <div className="flex flex-col w-full">
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Body" value="1" />
            <Tab label="Headers" value="2" />
            <Tab label="Response" value="3" />
            <Tab label="Code" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1" style={{ padding: 0, paddingTop: 16 }}>
          <div className="flex flex-1 bg-secondary p-2 rounded-md">
            <Editor
              height="90vh"
              theme="vs-dark"
              defaultLanguage="json"
              value={JSON.stringify(body || {}, null, 2)}
              className="rounded-md"
            />
          </div>
        </TabPanel>
        <TabPanel value="2" style={{ padding: 0, paddingTop: 16 }}>
          <div className="flex flex-1 bg-secondary p-2 rounded-md">
            <Editor
              height="90vh"
              theme="vs-dark"
              defaultLanguage="json"
              value={JSON.stringify(headers || {}, null, 2)}
              className="rounded-md"
            />
          </div>
        </TabPanel>
        <TabPanel value="3" style={{ padding: 0, paddingTop: 16 }}>
          <div className="flex flex-1 bg-secondary p-2 rounded-md">
            <Editor
              height="90vh"
              theme="vs-dark"
              defaultLanguage="json"
              value={JSON.stringify(
                responseData(invocation?.response),
                null,
                2
              )}
              className="rounded-md"
            />
          </div>
        </TabPanel>
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
          <div className="flex bg-secondary p-2 rounded-md ">
            <Editor
              width={"100%"}
              height={"250px"}
              theme="vs-dark"
              language={codeLanguage}
              value={languageCodeText}
            />
          </div>
        </TabPanel>
      </TabContext>
      {snackbar.component}
    </div>
  );
}
