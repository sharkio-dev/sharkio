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
const SniffersPage = () => {
  const [activeSniffer, setActiveSniffer] = useState<Sniffer>();
  const [activeEndpoint, setActiveEndpoint] = useState<EndpointType>();
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadSniffers } = useSniffersStore();
  const { user } = useAuthStore();
  const [invocations, setInvocations] = useState<InvocationType[]>([
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
  const [activeInvocation, setActiveInvocation] = useState<InvocationType>();
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
                  <InvocationUpperBar activeEndpoint={activeEndpoint} />
                )}
              </div>
              <div className="flex flex-col p-2 px-4 h-1/3 max-h-[calc(33vh-16px)] overflow-y-auto">
                {activeEndpoint && (
                  <InvocationsBottomBar
                    invocations={invocations}
                    activeInvocation={activeInvocation}
                    setActiveInvocation={setActiveInvocation}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col h-full max-h-[calc(100vh-96px)] w-1/3 p-4 border-l border-border-color overflow-y-auto">
              <EndpointSideBar
                activeEndpoint={activeEndpoint}
                setActiveEndpoint={setActiveEndpoint}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

type InvocationUpperBarProps = {
  activeEndpoint: EndpointType;
};

const InvocationUpperBar = ({ activeEndpoint }: InvocationUpperBarProps) => {
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
      <div className="flex flex-row items-center space-x-4 mt-4 flex-1">
        <Tabs />
      </div>
    </>
  );
};

export default SniffersPage;
