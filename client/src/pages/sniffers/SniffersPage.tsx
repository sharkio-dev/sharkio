import { useEffect, useState } from "react";
import { SniffersSideBar } from "./SniffersSideBar";
import { Sniffer, useSniffersStore } from "../../stores/sniffersStores";
import { useAuthStore } from "../../stores/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";
import { TextField } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { selectIconByMethod } from "./selectIconByMethod";
import { EndpointType, InvocationType } from "./types";
import { EndpointSideBar } from "./EndpointSideBar";
import { InvocationsBottomBar } from "./InvocationsBottomBar";
import { LoadingIcon } from "./LoadingIcon";
import { getInvocations } from "../../api/api";
import JSONPretty from "react-json-pretty";
import { generateCurlCommand } from "../../lib/jsonSchema";

type InvocationDetailsProps = {
  invocation: InvocationType;
};

export function InvocationDetails({ invocation }: InvocationDetailsProps) {
  const [value, setValue] = React.useState("1");
  const [invocationBody, setInvocationBody] = useState(invocation.body);
  const [invocationHeaders, setInvocationHeaders] = useState(
    invocation.headers
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  console.log({ invocation });

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
            <JSONPretty data={invocationBody}></JSONPretty>
          </div>
        </TabPanel>
        <TabPanel value="2" style={{ padding: 0, paddingTop: 16 }}>
          <div className="flex flex-1 bg-secondary p-2 rounded-md">
            <JSONPretty data={invocationHeaders}></JSONPretty>
          </div>
        </TabPanel>
        <TabPanel value="3" style={{ padding: 0, paddingTop: 16 }}></TabPanel>
        <TabPanel
          value="4"
          style={{ padding: 0, paddingTop: 16, width: "100%" }}
        >
          <div className="flex flex-1 bg-secondary p-2 rounded-md ">
            <JSONPretty data={generateCurlCommand(invocation)}></JSONPretty>
          </div>
        </TabPanel>
      </TabContext>
    </div>
  );
}
const SniffersPage = () => {
  const [activeSniffer, setActiveSniffer] = useState<Sniffer>();
  const [activeEndpoint, setActiveEndpoint] = useState<EndpointType>();
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadSniffers } = useSniffersStore();
  const { user } = useAuthStore();
  const [invocations, setInvocations] = useState<InvocationType[]>([]);
  const [activeInvocation, setActiveInvocation] = useState<InvocationType>();
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingSniffers, setLoadingSniffers] = useState(false);
  const userId = user?.id;

  useEffect(() => {
    if (!activeEndpoint) return;
    setLoadingRequests(true);
    getInvocations(activeEndpoint.id)
      .then((res) => {
        setInvocations(res.data);
        console.log({ request: res.data });
      })
      .catch((err) => {
        showSnackbar("Failed to get invocations", "error");
      })
      .finally(() => {
        setLoadingRequests(false);
      });
  }, [activeEndpoint]);

  useEffect(() => {
    if (!userId) return;
    setLoadingSniffers(true);
    loadSniffers()
      .catch(() => {
        showSnackbar("Failed to get sniffers", "error");
      })
      .finally(() => {
        setLoadingSniffers(false);
      });
  }, [userId]);

  return (
    <div className="flex flex-row h-full w-full">
      {snackBar}
      <div className="relative min-w-[240px] border-r-[0.1px] border-border-color bg-secondary">
        {loadingSniffers ? (
          <div className="flex h-full justify-center items-center">
            <LoadingIcon />
          </div>
        ) : (
          <SniffersSideBar
            activeSniffer={activeSniffer}
            setActiveSniffer={setActiveSniffer}
          />
        )}
      </div>
      <div className="flex bg-tertiary h-full w-full">
        {activeSniffer && (
          <div className="flex flex-row flex-1">
            <div className="flex flex-col w-full">
              <div className="flex flex-col p-4 px-4 border-b border-border-color h-2/3 max-h-[calc(67vh-56px)] overflow-y-auto">
                {activeEndpoint && activeInvocation && (
                  <InvocationUpperBar
                    activeEndpoint={activeEndpoint}
                    activeInvocation={activeInvocation}
                  />
                )}
              </div>
              <div className="flex flex-col p-2 px-4 h-1/3 max-h-[calc(33vh-16px)] overflow-y-auto overflow-x-auto">
                {activeEndpoint &&
                  (loadingRequests ? (
                    <div className="flex flex-1 justify-center items-center">
                      <LoadingIcon />
                    </div>
                  ) : (
                    <InvocationsBottomBar
                      invocations={invocations}
                      activeInvocation={activeInvocation}
                      setActiveInvocation={setActiveInvocation}
                    />
                  ))}
              </div>
            </div>
            <div className="flex flex-col h-full max-h-[calc(100vh-96px)] w-1/3 p-4 border-l border-border-color overflow-y-auto">
              {activeSniffer && (
                <EndpointSideBar
                  activeEndpoint={activeEndpoint}
                  setActiveEndpoint={setActiveEndpoint}
                  activeSniffer={activeSniffer}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

type InvocationUpperBarProps = {
  activeEndpoint: EndpointType;
  activeInvocation: InvocationType;
};

const InvocationUpperBar = ({
  activeEndpoint,
  activeInvocation,
}: InvocationUpperBarProps) => {
  return (
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
      <div className="flex flex-row space-x-4 mt-4 flex-1">
        <InvocationDetails invocation={activeInvocation} />
      </div>
    </>
  );
};

export default SniffersPage;
