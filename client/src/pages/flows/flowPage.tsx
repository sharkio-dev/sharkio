import { useState } from "react";
import InnerPageTemplate from "../../components/inner-page-template/inner-page-template";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoSaveOutline } from "react-icons/io5";
import { Button, Input, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { TextButton } from "../../components/TextButton";
import { selectIconByMethod } from "../sniffers/selectIconByMethod";
import { MdChevronRight } from "react-icons/md";

const FLOW = {
  id: "673bf1a6-8662-41a2-a1eb-6e7acba75629",
  name: "Test flow 1",
  executionType: "sequence",
  ownerId: "d60ed1e5-0502-4fd3-a3f0-4603fcca1cbc",
  createdAt: "2024-01-26T12:57:18.932Z",
  updatedAt: "2024-01-26T12:57:18.932Z",
};

const FLOW_STEP = {
  id: "d70692d2-5ab8-44ba-ad0e-3e9cb0ab91d4",
  ownerId: "d60ed1e5-0502-4fd3-a3f0-4603fcca1cbc",
  flowId: "673bf1a6-8662-41a2-a1eb-6e7acba75629",
  proxyId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  name: "Test name",
  url: "/URL",
  body: "",
  subdomain: "ron-demo-9usub",
  headers: {},
  assertions: [
    {
      path: "body.example",
      comparator: "eq",
      expectedValue: "example",
    },
  ],
  method: "GET",
  createdAt: "2024-01-26T14:22:52.255Z",
  updatedAt: "2024-01-26T14:22:52.255Z",
};

interface Flow {
  id: string;
  name: string;
  executionType: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface FlowStep {
  id: string;
  ownerId: string;
  flowId: string;
  proxyId: string;
  name: string;
  url: string;
  body: string;
  subdomain: string;
  headers: object;
  assertions: any[];
  method: string;
  createdAt: string;
  updatedAt: string;
}

const FlowPage = () => {
  return (
    <InnerPageTemplate
      sideBarComponent={FlowSideBar}
      contentComponent={FlowContent}
    />
  );
};

const FlowSideBar: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4 px-2">
      <div className="flex flex-row items-center">
        <div className="text-2xl font-bold">Flows</div>
      </div>
    </div>
  );
};

const FlowContent: React.FC = () => {
  const [flow, setFlow] = useState<Partial<Flow>>(FLOW);
  const [isLoading, setIsLoading] = useState(false);
  const [tabNumber, setTabNumber] = useState("1");

  const handleTabChange = (_: any, newValue: string) => {
    setTabNumber(newValue);
  };

  const handleFlowNameChange = (name: string) => {
    setFlow({ ...flow, name });
  };

  const handleSaveClicked = () => {
    setIsLoading(true);
    console.log("save clicked");
    setIsLoading(false);
  };

  return (
    <>
      <FlowNameAndSave
        isLoading={isLoading}
        name={flow.name!}
        handleNameChange={handleFlowNameChange}
        handleSaveClicked={handleSaveClicked}
      />
      <TabContext value={tabNumber}>
        <TabList onChange={handleTabChange}>
          <Tab label="Tests" value="1" />
          <Tab label="Runs" value="2" />
        </TabList>
        <TestsTab steps={[FLOW_STEP]} />
        <RunsTab />
      </TabContext>
    </>
  );
};

interface TestsTab {
  steps: FlowStep[];
}

const TestsTab: React.FC<TestsTab> = ({ steps }) => {
  return (
    <TabPanel value="1" style={{ padding: 0, paddingTop: 16, height: "100%" }}>
      <TextButton text="Add Test" onClick={() => {}} />
      {steps.map((step) => (
        <div className="flex flex-col border border-border-color p-2 px-4 mt-4 shadow-md hover:border-blue-400 cursor-grab rounded-md min-h-[48px] active:cursor-grabbing justify-center">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col justify-center">
              <div className="flex flex-row items-center space-x-2">
                <div className="text-lg font-bold">{step.name}</div>
              </div>
              <div className="flex flex-row items-center space-x-2">
                {selectIconByMethod(step.method)}
                <div className="text-sm text-gray-400">Proxy Name</div>
                <div className="text-sm text-gray-400 truncate max-w-[75ch]">
                  {step.url}
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <AiOutlineDelete className=" active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md" />
              <MdChevronRight className=" active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </TabPanel>
  );
};
const RunsTab: React.FC = () => {
  return (
    <TabPanel value="2" style={{ padding: 0, paddingTop: 16, height: "100%" }}>
      Runs
    </TabPanel>
  );
};

interface FlowNameAndSaveProps {
  isLoading: boolean;
  name: string;
  handleSaveClicked: () => void;
  handleNameChange: (namg: string) => void;
  isNew?: boolean;
  handleCreateClicked?: () => void;
}

const FlowNameAndSave: React.FC<FlowNameAndSaveProps> = ({
  isLoading,
  name,
  handleNameChange,
  handleSaveClicked,
  isNew = true,
  handleCreateClicked,
}) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <EditableNameField
        isLoading={isLoading}
        name={name}
        handleNameChange={handleNameChange}
        handleSaveClicked={handleSaveClicked}
      />
      {!isNew && (
        <Button
          variant="outlined"
          color="success"
          sx={{ height: "32px" }}
          onAbort={handleSaveClicked}
        >
          Save
        </Button>
      )}
      {isNew && (
        <Button
          variant="outlined"
          color="success"
          sx={{ height: "32px" }}
          onAbort={handleCreateClicked}
        >
          Create
        </Button>
      )}
    </div>
  );
};

interface EditableNameProps {
  isLoading: boolean;
  name: string;
  handleSaveClicked: () => void;
  handleNameChange: (namg: string) => void;
}

const EditableNameField: React.FC<EditableNameProps> = ({
  isLoading = true,
  name,
  handleNameChange,
  handleSaveClicked,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const onSaveClicked = (e: any) => {
    e.stopPropagation();
    handleSaveClicked();
    setIsEditing(false);
  };

  return (
    <div className="flex flex-row items-center space-x-2 justify-center h-8">
      {isEditing ? (
        <>
          {isLoading ? (
            <LoadingIcon />
          ) : (
            <IoSaveOutline
              className="text-blue-400 active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md"
              onClick={onSaveClicked}
            />
          )}
          <Input
            className="w-[30ch] border-none focus:ring-0"
            defaultValue={name}
            onChange={(e: any) => handleNameChange(e.target.value)}
          />
        </>
      ) : (
        <>
          <AiOutlineEdit
            onClick={(e: any) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className=" text-blue-400 active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md"
          />
          <span className="truncate max-w-[50ch]">{name}</span>
        </>
      )}
    </div>
  );
};

export default FlowPage;
