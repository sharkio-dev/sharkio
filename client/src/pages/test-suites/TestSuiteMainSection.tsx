import * as React from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { SelectComponent } from "./SelectComponent";
import { BodySection } from "./BodySection";
import { HeaderSection } from "./HeaderSection";
import { CiSaveDown2 } from "react-icons/ci";
import { Rule, TestType, getTest } from "../../stores/testStore";
import { useParams } from "react-router-dom";
import { BackendAxios } from "../../api/backendAxios";
import { useSnackbar } from "../../hooks/useSnackbar";
import { LoadingIcon } from "../sniffers/LoadingIcon";

export const TestSuiteMainSection = () => {
  const [value, setValue] = React.useState("1");
  const [test, setTest] = React.useState<TestType | null>(null);
  const { testSuiteId, testId } = useParams();
  const [statusCodeRule, setStatusCodeRule] = React.useState<Rule>({
    type: "status_code",
    expectedValue: "200",
    comparator: "equals",
  });
  const [bodyRule, setBodyRule] = React.useState<Rule>({
    type: "body",
    expectedValue: "",
    comparator: "equals",
  });
  const [headerRules, setHeaderRules] = React.useState<Rule[]>([]);
  const [saveLoading, setSaveLoading] = React.useState<boolean>(false);
  const { show, component: snackBar } = useSnackbar();

  const extractStatusCode = (test: TestType) => {
    test.rules.forEach((rule) => {
      if (rule.type === "status_code") {
        setStatusCodeRule(rule);
      }
    });
  };

  const extractBody = (test: TestType) => {
    test.rules.forEach((rule) => {
      if (rule.type === "body") {
        setBodyRule(rule);
      }
    });
  };

  const extractHeaders = (test: TestType) => {
    const headers: Rule[] = [];
    test.rules.forEach((rule) => {
      if (rule.type === "header") {
        headers.push(rule);
      }
    });
    setHeaderRules(headers);
  };

  React.useEffect(() => {
    if (!testSuiteId || !testId) {
      return;
    }
    getTest(testSuiteId, testId).then((res) => {
      setTest(res.data);
      extractStatusCode(res.data);
      extractBody(res.data);
      extractHeaders(res.data);
    });
  }, [testSuiteId, testId]);

  const handleChange = (_: any, newValue: string) => {
    setValue(newValue);
  };

  const hadnleSave = () => {
    setSaveLoading(true);
    BackendAxios.put(`/test-suites/${testSuiteId}/tests/${testId}`, {
      name: test?.name,
      rules: [statusCodeRule, bodyRule, ...headerRules],
    })
      .then(() => {
        show("Test saved successfully", "success");
      })
      .catch(() => {
        show("Error saving test", "error");
      })
      .finally(() => {
        setSaveLoading(false);
      });
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
    <>
      {testId && (
        <>
          {snackBar}
          <div className="flex flex-row items-center justify-between">
            <span className="text-white text-xl font-bold">{test?.name}</span>
            {!saveLoading ? (
              <CiSaveDown2
                className="text-blue-400 text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
                onClick={hadnleSave}
              />
            ) : (
              <LoadingIcon />
            )}
          </div>

          <TabContext value={value}>
            <div className="flex flex-row items-center justify-between">
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Expected Body" value="1" />
                <Tab label="Expected Headers" value="2" />
              </TabList>
              <div className="flex w-1/4 items-center h-full">
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
        </>
      )}
    </>
  );
};
