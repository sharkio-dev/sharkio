import * as React from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { SelectComponent } from "./SelectComponent";
import { BodySection } from "./BodySection";
import { HeaderSection } from "./HeaderSection";
import { Rule } from "../../stores/testStore";

type TestConfigProps = {
  tabNumber: string;
  setTubNumber: (value: string) => void;
  statusCodeRule: Rule;
  setStatusCodeRule: (rule: Rule) => void;
  bodyRule: Rule;
  setBodyRule: (rule: Rule) => void;
  headerRules: Rule[];
  setHeaderRules: (rules: Rule[]) => void;
};
export const TestConfig = ({
  tabNumber,
  setTubNumber,
  statusCodeRule,
  setStatusCodeRule,
  bodyRule,
  setBodyRule,
  headerRules,
  setHeaderRules,
}: TestConfigProps) => {
  const handleChange = (_: any, newValue: string) => {
    setTubNumber(newValue);
  };

  const onChangeBodyValue = (value: string) => {
    setBodyRule({ ...bodyRule, expectedValue: value });
  };

  const onChangeStatusCodeValue = (value: string) => {
    setStatusCodeRule({ ...statusCodeRule, expectedValue: value });
  };

  const onChangeHeader = (index: number, value: any, targetPath: string) => {
    const headers = [...headerRules];
    headers[index] = {
      ...headers[index],
      targetPath: targetPath,
      expectedValue: value,
    };
    setHeaderRules(headers);
  };

  return (
    <TabContext value={tabNumber}>
      <div className="flex flex-row items-center justify-between ">
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Expected Body" value="1" />
          <Tab label="Expected Headers" value="2" />
        </TabList>
        <div className="flex w-1/4 items-center self-end">
          <SelectComponent
            options={[
              { value: "200", label: "200" },
              { value: "201", label: "201" },
              { value: "404", label: "404" },
            ]}
            title="Expected Status Code"
            value={statusCodeRule.expectedValue?.toString() || ""}
            setValue={onChangeStatusCodeValue}
          />
        </div>
      </div>
      <TabPanel value="1" style={{ padding: 0, paddingTop: 16 }}>
        <BodySection body={bodyRule} setBody={onChangeBodyValue} />
      </TabPanel>
      <TabPanel value="2" style={{ padding: 0, paddingTop: 16 }}>
        <HeaderSection
          headers={headerRules}
          setHeaders={onChangeHeader}
          addHeader={() =>
            setHeaderRules([
              ...headerRules,
              {
                type: "header",
                expectedValue: "",
                targetPath: "",
                comparator: "equals",
              },
            ])
          }
          deleteHeader={(index) =>
            setHeaderRules(headerRules.filter((_, i) => i !== index))
          }
        />
      </TabPanel>
    </TabContext>
  );
};
