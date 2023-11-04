import { useContext, useEffect, useState } from "react";
import { SniffersSideBar } from "./SniffersSideBar";
import { Sniffer, useSniffersStore } from "../../stores/sniffersStores";
import { useAuthStore } from "../../stores/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";
import { RequestsMetadataContext } from "../../context/requests-context";
import {
  TbHttpDelete,
  TbHttpGet,
  TbHttpOptions,
  TbHttpPatch,
  TbHttpPost,
  TbHttpPut,
} from "react-icons/tb";
import { TextField, Tooltip } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { CgSearch } from "react-icons/cg";
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

export function Tabs() {
  const [value, setValue] = React.useState("1");

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1", height: "100%" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Response" value="1" />
            <Tab label="Body" value="2" />
            <Tab label="Headers" value="3" />
            <Tab label="Code" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <TextField
            label="Response"
            variant="outlined"
            size="small"
            style={{ width: "100%" }}
            disabled
          />
        </TabPanel>
        <TabPanel value="2">
          <TextField
            label="Body"
            variant="outlined"
            size="small"
            style={{ width: "100%" }}
            disabled
          />
        </TabPanel>
        <TabPanel value="3">
          <TextField
            label="Headers"
            variant="outlined"
            size="small"
            style={{ width: "100%" }}
            disabled
          />
        </TabPanel>
        <TabPanel value="4">
          <TextField
            label="Code"
            variant="outlined"
            size="small"
            style={{ width: "100%" }}
            disabled
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
type Endpoint = {
  id: string;
  method: string;
  url: string;
};

const SniffersPage = () => {
  const [activeSniffer, setActiveSniffer] = useState<Sniffer>();
  const [activeEndpoint, setActiveEndpoint] = useState<Endpoint>();
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadSniffers } = useSniffersStore();
  const { user } = useAuthStore();
  const [invocations, setInvocations] = useState([
    { id: "1", status: 200, url: "https://google.com" },
    { id: "2", status: 400, url: "https://google.com" },
    { id: "3", status: 500, url: "https://google.com" },
    { id: "1", status: 200, url: "https://google.com" },
    { id: "2", status: 400, url: "https://google.com" },
    { id: "3", status: 500, url: "https://google.com" },
    { id: "1", status: 200, url: "https://google.com" },
    { id: "2", status: 400, url: "https://google.com" },
    { id: "3", status: 500, url: "https://google.com" },
    { id: "1", status: 200, url: "https://google.com" },
    { id: "2", status: 400, url: "https://google.com" },
    { id: "3", status: 500, url: "https://google.com" },
  ]);
  const [activeInvocation, setActiveInvocation] = useState<string>();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    loadSniffers().catch(() => {
      showSnackbar("Failed to get sniffers", "error");
    });
  }, [userId]);

  return (
    <div className="flex flex-row h-full w-full">
      {snackBar}
      <SniffersSideBar
        activeSniffer={activeSniffer}
        setActiveSniffer={setActiveSniffer}
      />
      <div className="flex bg-tertiary h-full w-full">
        {activeSniffer && (
          <div className="flex flex-row flex-1">
            <div className="flex flex-col w-full">
              <div className="flex flex-col p-4 px-4 border-b border-border-color h-2/3 overflow-y-auto">
                {activeEndpoint && (
                  <>
                    <div className="flex flex-row items-center space-x-4">
                      {selectIconByMethod(activeEndpoint.method)}
                      <TextField
                        label={activeEndpoint.url}
                        variant="outlined"
                        size="small"
                        style={{ width: "100%" }}
                        disabled
                      />
                      <PlayArrow className="text-green-500 cursor-pointer" />
                    </div>
                    <div className="flex flex-row items-center space-x-4 mt-4 flex-1">
                      <Tabs />
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col p-2 px-4 h-1/3 overflow-y-auto">
                <div className="flex flex-row justify-between items-center text-center mb-4">
                  <div className="text-xl font-bold font-mono ">
                    Invocations
                  </div>
                  <CgSearch className="text-gray-500 text-xl cursor-pointer" />
                </div>
                {invocations &&
                  invocations?.map((invocation) => {
                    return (
                      <Invocation
                        isSelected={invocation.id === activeInvocation}
                        onClick={() => setActiveInvocation(invocation.id)}
                        key={invocation.id}
                        status={invocation.status}
                        url={invocation.url}
                      />
                    );
                  })}
              </div>
            </div>

            <EndpointSideBar
              activeEndpoint={activeEndpoint}
              setActiveEndpoint={setActiveEndpoint}
            />
          </div>
        )}
      </div>
    </div>
  );
};

type EndpointSideBarProps = {
  activeEndpoint?: Endpoint;
  setActiveEndpoint: (endpointId: Endpoint) => void;
};

const EndpointSideBar = ({
  activeEndpoint,
  setActiveEndpoint,
}: EndpointSideBarProps) => {
  const {
    requestsData: requests,
    servicesData: services,
    loadData,
    loading,
  } = useContext(RequestsMetadataContext);

  useEffect(() => {
    loadData?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const manyRequests = requests
    ? [
        ...requests,
        { id: "1", method: "DELETE", url: "https://google.com" },
        { id: "2", method: "PUT", url: "https://google.com" },
        { id: "3", method: "POST", url: "https://google.com" },
        { id: "4", method: "PATCH", url: "https://google.com" },
        { id: "5", method: "OPTIONS", url: "https://google.com" },
      ]
    : [];

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-96px)] w-1/3 p-4 border-l border-border-color overflow-y-auto">
      <TextField
        label="Search Endpoint"
        variant="outlined"
        style={{ marginBottom: "16px" }}
        size="small"
      />
      {requests &&
        services &&
        manyRequests?.map((request) => {
          return (
            <Endpoint
              isSelected={request.id === activeEndpoint?.id}
              onClick={() => setActiveEndpoint(request)}
              key={request.id}
              method={request.method}
              url={request.url}
            />
          );
        })}
    </div>
  );
};

const selectIconByMethod = (method: string) => {
  switch (method) {
    case "GET":
      return <TbHttpGet className="text-green-500 h-8 w-8 p-1" />;
    case "POST":
      return <TbHttpPost className="text-blue-500 h-8 w-8 p-1" />;
    case "PUT":
      return <TbHttpPut className="text-yellow-500 h-8 w-8 p-1" />;
    case "PATCH":
      return <TbHttpPatch className="text-purple-500 h-8 w-8 p-1" />;
    case "DELETE":
      return <TbHttpDelete className="text-red-500 h-8 w-8 p-1" />;
    case "OPTIONS":
      return <TbHttpOptions className="text-gray-500 h-8 w-8 p-1" />;
    default:
      return;
  }
};

type EndpointProps = {
  timestamp?: string;
  method: string;
  url: string;
  isSelected?: boolean;
  onClick?: () => void;
};

const Endpoint = ({ method, url, isSelected, onClick }: EndpointProps) => {
  return (
    <Tooltip title={url} placement="top" arrow enterDelay={500}>
      <div
        className={`flex flex-row w-full hover:bg-secondary p-2 cursor-pointer active:bg-primary items-center rounded-md space-x-4
    ${isSelected ? "bg-primary" : ""}`}
        onClick={onClick}
      >
        {selectIconByMethod(method)}
        <div className="flex text-sm max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
          {url}
        </div>
      </div>
    </Tooltip>
  );
};

type InvocationType = {
  status: number;
  url: string;
  isSelected?: boolean;
  onClick?: () => void;
};

const Invocation = ({ status, url, isSelected, onClick }: InvocationType) => {
  const selectIconByStatus = (status: number) => {
    if (status < 300) {
      return <span className="text-green-500 h-8 w-8 p-1 mr-4">{status}</span>;
    } else if (status < 400) {
      return <span className="text-yellow-500 h-8 w-8 p-1 mr-4">{status}</span>;
    }
    return <span className="text-red-500 h-8 w-8 p-1 mr-4">{status}</span>;
  };

  return (
    <Tooltip title={url} placement="top" arrow enterDelay={500}>
      <div
        className={`flex flex-row w-full hover:bg-secondary cursor-pointer active:bg-primary items-center hover:rounded-md justify-between border-b border-border-color 
    ${isSelected ? "bg-primary" : ""}`}
        onClick={onClick}
      >
        <div className="flex flex-row items-center">
          {selectIconByStatus(status)}
          <div className="flex text-sm max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
            {url}
          </div>
        </div>
        <div className="flex flex-row items-center">
          <PlayArrow className="text-green-500 p-1" />
        </div>
      </div>
    </Tooltip>
  );
};

export default SniffersPage;
