import * as React from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { PlayArrowOutlined } from "@mui/icons-material";
import TabPanel from "@mui/lab/TabPanel";
import { SelectComponent } from "./SelectComponent";
import { BodySection } from "./BodySection";
import { HeaderSection } from "./HeaderSection";

export const TestSuiteMainSection = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (_: any, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <span className="text-white text-xl font-bold">Positive</span>
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
          <BodySection />
        </TabPanel>
        <TabPanel value="2" style={{ padding: 0, paddingTop: 16 }}>
          <HeaderSection />
        </TabPanel>
      </TabContext>
    </>
  );
};
