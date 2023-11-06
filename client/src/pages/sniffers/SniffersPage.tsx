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
import { getEnpoints, getInvocations, getRequests } from "../../api/api";
import { generateCurlCommand } from "../../lib/jsonSchema";
import Editor from "@monaco-editor/react";

type InvocationDetailsProps = {
  invocation: InvocationType;
};

export function InvocationDetails({ invocation }: InvocationDetailsProps) {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const responseData = (response: any) => {
    let data = {
      body: {},
      headers: {},
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
              defaultValue={JSON.stringify(invocation.body, null, 2)}
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
              defaultValue={JSON.stringify(invocation.headers, null, 2)}
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
                responseData(invocation.response),
                null,
                2
              )}
              className="rounded-md"
            />
          </div>
        </TabPanel>
        <TabPanel value="4" style={{ padding: 0, paddingTop: 16 }}>
          <div className="flex bg-secondary p-2 rounded-md ">
            <Editor
              width={"100%"}
              height={"250px"}
              theme="vs-dark"
              defaultLanguage="bash"
              defaultValue={generateCurlCommand(invocation)}
            />
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
  const [loadingEndpoints, setLoadingEndpoints] = useState(false);
  const [endpoints, setEndpoints] = useState<EndpointType[]>([]);
  const [intervalInvocations, setIntervalInvocations] =
    useState<NodeJS.Timeout>();
  const userId = user?.id;

  useEffect(() => {
    if (!activeSniffer) {
      const loadInvocations = () => {
        setLoadingRequests(true);
        getRequests()
          .then((res) => {
            setInvocations(res.data);
            if (res.data.length > 0) {
              setActiveInvocation(res.data[0]);
            }
          })
          .finally(() => {
            setLoadingRequests(false);
          });
      };
      loadInvocations();
      const int = setInterval(() => {
        loadInvocations();
      }, 60000);

      setIntervalInvocations(int);
      return () => {
        clearInterval(int);
      };
    }
    clearInterval(intervalInvocations);
    setIntervalInvocations(undefined);
    setLoadingEndpoints(true);
    getEnpoints(activeSniffer.id)
      .then((res) => {
        setEndpoints(res.data);
        if (res.data.length > 0) {
          setActiveEndpoint(res.data[0]);
        }
      })
      .catch((err) => {
        showSnackbar("Failed to get endpoints", "error");
      })
      .finally(() => {
        setLoadingEndpoints(false);
      });
  }, [activeSniffer]);

  useEffect(() => {
    if (!activeEndpoint) return;
    setLoadingRequests(true);
    getInvocations(activeEndpoint.id)
      .then((res) => {
        setInvocations(res.data);
        if (res.data.length > 0) {
          setActiveInvocation(res.data[0]);
        }
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

  const onSnifferClick = (sniffer: Sniffer) => {
    if (activeSniffer?.id === sniffer.id) {
      setActiveSniffer(undefined);
      return;
    }
    setActiveSniffer(sniffer);
  };

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
            setActiveSniffer={onSnifferClick}
          />
        )}
      </div>
      <div
        className={`flex bg-tertiary h-full ${
          activeSniffer ? "w-[calc(100vw-296px)]" : "w-full"
        }`}
      >
        <div
          className={`flex flex-col ${
            activeSniffer ? "w-[calc(100vw-296px-25%)]" : "w-full"
          }`}
        >
          <div className="flex flex-col p-4 px-4 border-b border-border-color h-2/3 max-h-[calc(67vh-56px)] overflow-y-auto">
            {activeInvocation && (
              <InvocationUpperBar
                activeEndpoint={activeInvocation}
                activeInvocation={activeInvocation}
              />
            )}
          </div>
          <div className="flex flex-col p-2 px-4 h-1/3 max-h-[calc(33vh-16px)] overflow-y-auto overflow-x-auto">
            {invocations &&
              (loadingRequests ? (
                <div className="flex flex-1 justify-center items-center">
                  <LoadingIcon />
                </div>
              ) : (
                <InvocationsBottomBar
                  title={activeSniffer ? "Invocations" : "🔴 Live Invocations"}
                  invocations={invocations}
                  activeInvocation={activeInvocation}
                  setActiveInvocation={setActiveInvocation}
                />
              ))}
          </div>
        </div>
        {activeSniffer && (
          <div className="flex flex-col h-full max-h-[calc(100vh-96px)] min-w-[25%] p-4 border-l border-border-color overflow-y-auto">
            {endpoints && loadingEndpoints ? (
              <div className="flex flex-1 justify-center items-center">
                <LoadingIcon />
              </div>
            ) : (
              <EndpointSideBar
                activeEndpoint={activeEndpoint}
                setActiveEndpoint={setActiveEndpoint}
                requests={endpoints}
              />
            )}
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
