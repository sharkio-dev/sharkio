import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AiOutlinePlus } from "react-icons/ai";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { PlayArrowOutlined } from "@mui/icons-material";
import Editor from "@monaco-editor/react";

const TestSuitePage = () => {
  const [value, setValue] = React.useState("1");
  const [body, setBody] = React.useState();

  const handleChange = (_: any, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className={`flex h-full flex-row w-[calc(100vw-56px)]`}>
      <div className="flex flex-col h-full min-w-[20%] w-[20%] border-r border-border-color bg-secondary py-4">
        <div className="flex flex-row items-center space-x-2 px-2">
          <SelectComponent
            options={[{ value: "1", label: "Test Suite 1" }]}
            title="Test Suite"
          />
          <AiOutlinePlus className="text-[#fff] text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110" />
        </div>
        <div className="flex flex-col space-y-2 mt-4">
          <MultiSelectTreeView />
        </div>
      </div>

      <div className="flex flex-col w-[calc(100vw-56px-20%)] p-4">
        <div className="flex flex-row items-center justify-between">
          <span className="text-white text-xl font-bold px-2 py-4">
            Positive
          </span>
          <PlayArrowOutlined className="text-green-400 text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110" />
        </div>

        <SelectComponent
          options={[{ value: "200", label: "200" }]}
          title="Status Code"
        />
        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Body" value="1" />
            <Tab label="Headers" value="2" />
          </TabList>
          <TabPanel value="1" style={{ padding: 0, paddingTop: 16 }}>
            <Editor
              height="50vh"
              width={"100%"}
              theme="vs-dark"
              defaultLanguage="json"
              value={body}
              onChange={(value) => setBody(value)}
              className="rounded-md"
            />
          </TabPanel>
          <TabPanel value="2" style={{ padding: 0, paddingTop: 16 }}>
            <div className="flex flex-row items-center space-x-2 px-2">
              <input
                className="border border-border-color rounded-md px-2 py-1 w-full"
                placeholder="Name"
              />
              <span className="text-white text-sm px-2 py-4">===</span>
              <input
                className="border border-border-color rounded-md px-2 py-1 w-full"
                placeholder="Value"
              />
            </div>
            <div className="flex flex-row items-center space-x-2 px-2 mt-2 w-32 cursor-pointer">
              <AiOutlinePlus className="flex text-green-400 hover:bg-border-color rounded-md hover:cursor-pointer" />
              <span className="hover:text-green-400">Add Header</span>
            </div>
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
};

type SelectComponentProps = {
  options: { value: string; label: string }[];
  title: string;
};

export function SelectComponent({ options, title }: SelectComponentProps) {
  const [testSuite, setTestSuite] = React.useState(
    options.length > 0 ? options[0].value : ""
  );

  const handleChange = (event: any) => {
    setTestSuite(event.target.value as string);
  };

  return (
    <FormControl sx={{ width: "100%" }} size="small">
      <InputLabel>{title}</InputLabel>
      <Select value={testSuite} label={title} onChange={handleChange}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import TabPanel from "@mui/lab/TabPanel";

export function MultiSelectTreeView() {
  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <TreeItem nodeId="1" label="/Users">
        <TreeItem nodeId="2" label="Positive" />
        <TreeItem nodeId="3" label="Negative" />
        <TreeItem nodeId="4" label="Security" />
        <TreeItem nodeId="5" label="Load Testing" />
      </TreeItem>
    </TreeView>
  );
}

export default TestSuitePage;
