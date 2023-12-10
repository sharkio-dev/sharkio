import TabList from "@mui/lab/TabList";
import { Tab } from "@mui/material";

type TestConfigProps = {
  setTabNumber: (tabNumber: string) => void;
};
export const TestConfig = ({ setTabNumber }: TestConfigProps) => {
  const handleChange = (_: any, newValue: string) => {
    setTabNumber(newValue);
  };

  return (
    <div className="flex flex-row items-center justify-between border-b border-border-color">
      <TabList onChange={handleChange} aria-label="lab API tabs example">
        <Tab label="Assertions" value="1" />
        <Tab label="Request" value="2" />
      </TabList>
    </div>
  );
};
