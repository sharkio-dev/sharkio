import { useEffect } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { InvocationType } from "./types";
import { generateCurlCommand } from "../../lib/jsonSchema";
import Editor from "@monaco-editor/react";
import { MenuItem, Select } from "@mui/material";

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
    let data = {
      body: {},
      headers: {},
      status: undefined,
    };
    if (!response) return data;
    data = response.data ? response.data : {};
    data = response.headers ? { ...data, headers: response.headers } : data;
    data = response.status ? { ...data, status: response.status } : data;
    return data;
  };
  useEffect(() => {
    setValue("1");
  }, [invocation]);

  const [codeLanguage, setCodeLanguage] = React.useState<string>(defaultCodeLanguage);

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
              defaultValue={JSON.stringify(invocation?.body || {}, null, 2)}
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
              defaultValue={JSON.stringify(invocation?.headers || {}, null, 2)}
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
              defaultValue={JSON.stringify(
                responseData(invocation?.response || {}),
                null,
                2,
              )}
              className="rounded-md"
            />
          </div>
        </TabPanel>
        <TabPanel value="4" style={{ padding: 0, paddingTop: 16 }}>
          <Select value={codeLanguage} defaultValue={"bash"} onChange={(evt) => setCodeLanguage(evt.target.value)}>
            <MenuItem value="bash">curl</MenuItem>
            <MenuItem value="javascript">javascript</MenuItem>
            <MenuItem value="python">python</MenuItem>
            <MenuItem value="java">java</MenuItem>
            <MenuItem value="golang">golang</MenuItem>
            <MenuItem value="php">php</MenuItem>
          </Select>
          <div className="flex bg-secondary p-2 rounded-md ">
            <Editor
              width={"100%"}
              height={"250px"}
              theme="vs-dark"
              defaultLanguage={defaultCodeLanguage}
              language={codeLanguage}
              defaultValue={invocation ? generateCurlCommand(invocation) : ""}
            />
          </div>
        </TabPanel>
      </TabContext>
    </div>
  );
}
