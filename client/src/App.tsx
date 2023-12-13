import {
  Button,
  CssBaseline,
  OutlinedInput,
  Step,
  StepLabel,
  Stepper,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  createTheme,
} from "@mui/material";
import { GiConfirmed, GiCancel } from "react-icons/gi";

import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { AuthWrapper } from "./AuthWrapper";
import { LandingPage } from "./LandingPage";
import { PageTemplate } from "./components/page-template/page-template";
import { routes } from "./constants/routes";
import APIKeys from "./pages/api-keys/api-keys";
import AuthUI from "./pages/auth/Auth";
import { SharkioDocsGettingStartedPage } from "./pages/docs/SharkioDocsGettingStartedPage";
import { SharkioDocsSetupPage } from "./pages/docs/SharkioDocsSetupPage";
import {
  CreateInvocationPage,
  SnifferEndpointPage,
  SnifferPage,
} from "./pages/sniffers/SniffersPage";
import { useAuthStore } from "./stores/authStore";
import { useThemeStore } from "./stores/themeStore";
import { ChatPage } from "./pages/chat/chat";
import TestSuitePage from "./pages/test-suites/testSuitePage";
import { MockPage } from "./pages/mocks/MockPage";
import { LivePage } from "./pages/sniffers/SniffersPage/LivePage";
import { SnifferType, useSniffersStore } from "./stores/sniffersStores";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import randomString from "random-string";
import { LoadingIcon } from "./pages/sniffers/LoadingIcon";
import { EditSnifferModal } from "./pages/sniffers/EditSnifferModal";
import { DeleteSnifferModal } from "./pages/sniffers/DeleteSnifferModal";

type SnifferBoxProps = {
  sniffer: SnifferType;
};

const SnifferBox = ({ sniffer }: SnifferBoxProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-secondary p-4 rounded-xl w-full h-[200px] shadow-lg">
      <div className="flex flex-row justify-between items-center">
        <div
          className="font-bold text-lg w-40 truncate hover:scale-105 active:scale-100 cursor-pointer"
          onClick={() => {
            let params = new URLSearchParams();
            params.append("snifferId", sniffer.id);
            let queryString = params.toString();
            navigate(`${routes.ENDPOINTS}/${sniffer.id}` + "?" + queryString);
          }}
        >
          {sniffer.name}
        </div>
        <div className="flex flex-row-reverse w-full ">
          <AiOutlineDelete
            className=" text-red-400 active:scale-110 text-lg cursor-pointer ml-4 hover:bg-border-color rounded-md"
            onClick={() => setIsDeleteModalOpen(true)}
          />
          <AiOutlineEdit
            className=" text-amber-400 active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md"
            onClick={() => setIsEditModalOpen(true)}
          />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center mt-2">
        <div className="text-sm text-gray-400">Domain</div>
        <div className="text-sm text-gray-400">
          https://{sniffer.subdomain}.{import.meta.env.VITE_PROXY_DOMAIN}
        </div>
      </div>
      <div className="flex flex-row justify-between items-center mt-2">
        <div className="text-sm text-gray-400">Target URL</div>
        <div className="text-sm text-gray-400">{sniffer.downstreamUrl}</div>
      </div>
      <div className="flex flex-row justify-between items-center mt-2">
        <div className="text-sm text-gray-400">Port</div>
        <div className="text-sm text-gray-400">{sniffer.port || "N/A"}</div>
      </div>
      <EditSnifferModal
        sniffer={sniffer}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
      <DeleteSnifferModal
        sniffer={sniffer}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

interface EnvStepProps {
  onNextClicked: () => void;
  value: boolean;
  handleChange: (newValue: boolean) => void;
}

const EnvStep = ({ onNextClicked, value, handleChange }: EnvStepProps) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-2xl font-bold font-sarif self-start">
        Is your server local?
      </div>
      <div className="flex flex-col h-[50vh] w-full items-center justify-center">
        <ToggleButtonGroup
          color="primary"
          value={value}
          size="large"
          exclusive
          onChange={(_, newValue) => {
            handleChange(newValue);
          }}
        >
          <ToggleButton value={true} className="w-32">
            <GiConfirmed className="mr-2 text-2xl text-green-400" />
            <div className="text-lg">Yes</div>
          </ToggleButton>
          <ToggleButton value={false} className="w-32">
            <GiCancel className="mr-2 text-2xl text-red-400" />
            <div className="text-lg">No</div>
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="flex flex-row justify-between w-full mt-8">
        <Button color="warning" disabled>
          Back
        </Button>
        <Button onClick={onNextClicked}>Next</Button>
      </div>
    </div>
  );
};

interface DomainStepProps {
  onNextClicked: () => void;
  onBackClicked: () => void;
  value: string;
  handleChange: (newValue: string) => void;
}

const DomainStep = ({
  onNextClicked,
  onBackClicked,
  value,
  handleChange,
}: DomainStepProps) => {
  const [isValid, setIsValid] = React.useState(false);
  const isValidHttpUrl = (string: string) => {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  };

  const onDomainChange = (newValue: string) => {
    handleChange(newValue);
    setIsValid(isValidHttpUrl(newValue));
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-2xl font-bold font-sarif self-start">
        What is your server's domain?
      </div>
      <div className="flex flex-col h-[50vh] w-full items-center justify-center">
        <OutlinedInput
          value={value}
          className="w-1/2"
          placeholder="https://example.com"
          onChange={(e) => onDomainChange(e.target.value)}
        />
      </div>
      <div className="flex flex-row justify-between w-full mt-8">
        <Button color="warning" onClick={onBackClicked}>
          Back
        </Button>
        <Button onClick={onNextClicked} disabled={!isValid}>
          Next
        </Button>
      </div>
    </div>
  );
};

interface PortStepProps {
  onNextClicked: () => void;
  onBackClicked: () => void;
  value: string;
  handleChange: (newValue: string) => void;
}

const PortStep = ({
  onNextClicked,
  onBackClicked,
  value,
  handleChange,
}: PortStepProps) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-2xl font-bold font-sarif self-start">
        What is your server's port?
      </div>
      <div className="flex flex-col h-[50vh] w-full items-center justify-center">
        <OutlinedInput
          className="w-1/2"
          placeholder="8080"
          type="number"
          value={value}
          onChange={(e) => {
            console.log(e.target.value);
            handleChange(e.target.value);
          }}
        />
      </div>
      <div className="flex flex-row justify-between w-full mt-8">
        <Button color="warning" onClick={onBackClicked}>
          Back
        </Button>
        <Button onClick={onNextClicked} disabled={value === ""}>
          Next
        </Button>
      </div>
    </div>
  );
};

interface NameStepProps {
  onNextClicked: () => void;
  onBackClicked: () => void;
  value: string;
  handleChange: (newValue: string) => void;
  isLoading: boolean;
}

const NameStep = ({
  onBackClicked,
  onNextClicked,
  value,
  handleChange,
  isLoading,
}: NameStepProps) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-2xl font-bold font-sarif self-start">
        Give your sniffer a name
      </div>
      <div className="flex flex-col h-[50vh] w-full items-center justify-center">
        <OutlinedInput
          className="w-1/2"
          placeholder="Sniffer name"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      <div className="flex flex-row justify-between w-full mt-8">
        <Button color="warning" onClick={onBackClicked}>
          Back
        </Button>
        {isLoading ? (
          <LoadingIcon />
        ) : (
          <Button onClick={onNextClicked} disabled={value === ""}>
            {" "}
            Next{" "}
          </Button>
        )}
      </div>
    </div>
  );
};

const DoneStep = ({ onNextClicked }: { onNextClicked: () => void }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-2xl font-bold font-sarif self-start">
        You have successfully created a sniffer!
      </div>
      <div className="flex flex-col h-[50vh] w-full items-center justify-center"></div>
      <div className="flex flex-row-reverse justify-between w-full mt-8">
        <Button color="success" onClick={onNextClicked}>
          Done
        </Button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { sniffers, loadSniffers } = useSniffersStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadSniffers(true).then((data) => {
      if (data.length === 0) {
        navigate(routes.PROXY_CREATE);
      }
    });
  }, []);

  return (
    <div
      className={`flex flex-col bg-tertiary h-[calc(vh-96px)] max-h-[calc(100vh-96px)] w-[calc(100vw-56px)] p-4`}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="text-2xl font-bold">Sniffers</div>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            navigate(routes.PROXY_CREATE);
          }}
        >
          + add
        </Button>
      </div>
      <div className="w-full border-b-[0.05px] mt-4 mb-8" />

      <div className="grid grid-cols-2 gap-2 w-full">
        {sniffers.map((sniffer) => (
          <SnifferBox sniffer={sniffer} />
        ))}
      </div>
    </div>
  );
};

const AddSnifferPage = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLocal, setIsLocal] = React.useState(false);
  const [domain, setDomain] = React.useState("https://");
  const [port, setPort] = React.useState("");
  const [name, setName] = React.useState("");
  const { createSniffer, loadingSniffers } = useSniffersStore();
  const [subdomain, _] = React.useState<string>(
    randomString({ length: 5 }).toLowerCase()
  );
  const navigator = useNavigate();

  const handlePortChange = (val: string) => {
    console.log({ v: val });
    if (Number(val) > 65535) {
      setPort("65535");
      return;
    }
    if (Number(val) < 0) {
      setPort("0");
      return;
    }
    console.log({ val });
    setPort(val.replace("-", ""));
  };

  const handleCreateSniffer = () => {
    createSniffer({
      name,
      downstreamUrl: isLocal ? "https://localhost" : domain,
      port: isLocal ? Number(port) : 80,
      subdomain: `${name}-${subdomain}`,
    }).then(() => {
      setActiveStep(3);
    });
  };

  return (
    <div
      className={`flex flex-col bg-tertiary h-[calc(vh-96px)] max-h-[calc(100vh-96px)] w-[calc(100vw-56px)] p-4`}
    >
      <div className="flex flex-col w-3/4 self-center">
        <Stepper activeStep={activeStep} className="w-full self-center mb-8">
          <Step key={"Environment"}>
            <StepLabel>{"Environment"}</StepLabel>
          </Step>
          <Step key={"Domain"}>
            <StepLabel>{"Domain"}</StepLabel>
          </Step>
          <Step key={"Name"}>
            <StepLabel>{"Name"}</StepLabel>
          </Step>
          <Step key={"Done"}>
            <StepLabel>{"Done"}</StepLabel>
          </Step>
        </Stepper>
        {activeStep === 0 && (
          <EnvStep
            onNextClicked={() => setActiveStep(1)}
            value={isLocal}
            handleChange={setIsLocal}
          />
        )}
        {activeStep === 1 && !isLocal && (
          <DomainStep
            value={domain}
            handleChange={setDomain}
            onNextClicked={() => setActiveStep(2)}
            onBackClicked={() => setActiveStep(0)}
          />
        )}
        {activeStep === 1 && isLocal && (
          <PortStep
            onNextClicked={() => setActiveStep(2)}
            onBackClicked={() => setActiveStep(0)}
            value={port}
            handleChange={handlePortChange}
          />
        )}
        {activeStep === 2 && (
          <NameStep
            onBackClicked={() => setActiveStep(1)}
            onNextClicked={handleCreateSniffer}
            value={name}
            handleChange={setName}
            isLoading={loadingSniffers}
          />
        )}
        {activeStep === 3 && (
          <DoneStep
            onNextClicked={() => {
              navigator(routes.ROOT);
            }}
          />
        )}
      </div>
    </div>
  );
};

function App(): React.JSX.Element {
  const { mode } = useThemeStore();
  const { user } = useAuthStore();

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  const routesWithAuth = () => {
    const routesWithAuth = [
      { path: routes.PROXIES, element: <HomePage /> },
      { path: routes.PROXY_CREATE, element: <AddSnifferPage /> },
      { path: routes.API_KEYS, element: <APIKeys /> },
      { path: routes.REQUESTS, element: <LivePage /> },
      { path: routes.ENDPOINTS, element: <SnifferPage /> },
      { path: routes.ENDPOINT, element: <SnifferEndpointPage /> },
      { path: routes.ENDPOINTS_INVOCATION, element: <SnifferEndpointPage /> },
      {
        path: routes.CREATE_ENDPOINT,
        element: <CreateInvocationPage />,
      },
      { path: routes.REQUEST, element: <LivePage /> },
      { path: routes.CHAT, element: <ChatPage /> },
      { path: routes.TEST_SUITES, element: <TestSuitePage /> },
      { path: routes.TEST_SUITE, element: <TestSuitePage /> },
      { path: routes.TEST_SUITE_TEST, element: <TestSuitePage /> },
      { path: routes.TEST_ENDPOINT, element: <TestSuitePage /> },
      { path: routes.MOCKS, element: <MockPage /> },
      { path: routes.MOCK, element: <MockPage /> },
    ];

    return routesWithAuth.map(({ path, element }) => (
      <Route
        key={path}
        path={path}
        element={
          <PageTemplate>
            <AuthUI>{element}</AuthUI>
          </PageTemplate>
        }
      />
    ));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthWrapper>
          <Routes>
            {routesWithAuth()}
            <Route
              path={"*"}
              element={
                <PageTemplate>
                  {user ? <HomePage /> : <LandingPage />}
                </PageTemplate>
              }
            />
            <Route
              path={routes.DOCS_GETTING_STARTED}
              element={
                <PageTemplate isSideBar={false}>
                  <SharkioDocsGettingStartedPage />
                </PageTemplate>
              }
            />
            <Route
              path={routes.DOCS_SETUP}
              element={
                <PageTemplate isSideBar={false}>
                  <SharkioDocsSetupPage />
                </PageTemplate>
              }
            />
            <Route
              path={routes.LOGIN}
              element={
                <PageTemplate>
                  <AuthUI />
                </PageTemplate>
              }
            />
          </Routes>
        </AuthWrapper>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
