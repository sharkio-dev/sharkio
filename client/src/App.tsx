import {
  CssBaseline,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ThemeProvider,
  ToggleButton,
  ToggleButtonGroup,
  createTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
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
  LiveSnifferPage,
  SnifferEndpointPage,
  SnifferPage,
} from "./pages/sniffers/SniffersPage";
import { useAuthStore } from "./stores/authStore";
import { useThemeStore } from "./stores/themeStore";
import { ChatPage } from "./pages/chat/chat";
import TestSuitePage from "./pages/test-suites/testSuitePage";
import { useSniffersStore } from "./stores/sniffersStores";
import { SideBarItem } from "./pages/sniffers/SniffersSideBar";
import { GiSharkFin } from "react-icons/gi";
import { StatusCodeSelector } from "./pages/test-suites/TestConfig";
import { BodySection } from "./pages/test-suites/BodySection";
import { HeaderSection } from "./pages/test-suites/HeaderSection";
import { EndpointSideBar } from "./pages/sniffers/EndpointSideBar";

const MockPage = () => {
  const { sniffers, loadSniffers, loadEndpoints } = useSniffersStore();
  const { snifferId } = useParams();
  const navigator = useNavigate();
  const [section, setSection] = React.useState<"Status" | "Body" | "Headers">(
    "Body",
  );

  useEffect(() => {
    loadSniffers(true);
  }, []);

  return (
    <div className={`flex h-full flex-row w-[calc(100vw-56px)]`}>
      <div className="flex flex-col h-full min-w-[240px] w-[240px] border-r border-border-color bg-secondary">
        <div className="flex flex-col justify-between items-center px-2 pt-4 space-y-4 h-[calc(vh-96px)] max-h-[calc(vh-96px)] overflow-y-auto">
          <FormControl fullWidth size="small" variant="outlined">
            <InputLabel>Sniffers</InputLabel>
            <Select value={snifferId} label="Sniffers">
              {sniffers.map((sniffer, i) => (
                <MenuItem
                  key={i}
                  value={sniffer.id}
                  onClick={() => {
                    navigator(`/mocks/sniffers/${sniffer.id}`);
                    loadEndpoints(sniffer.id);
                  }}
                >
                  <SideBarItem
                    LeftIcon={GiSharkFin}
                    isSelected={snifferId === sniffer.id}
                    name={sniffer.name}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className="flex flex-col w-full overflow-y-auto">
            <EndpointSideBar showAdd={true} />
          </div>
        </div>
      </div>

      <div className="flex flex-col max-h-[calc(100vh-96px)] w-[calc(100vw-56px-240px)] p-4 space-y-4 overflow-y-auto">
        <div className="flex flex-col h-full p-2 rounded-md overflow-y-auto">
          <ToggleButtonGroup
            color="primary"
            exclusive
            onChange={(_, value) => setSection(value)}
            className="flex flex-row w-full items-center justify-center mb-8"
            value={section}
          >
            <ToggleButton value="Status" className="w-24 h-6">
              Status
            </ToggleButton>
            <ToggleButton value="Body" className="w-24 h-6">
              Body
            </ToggleButton>
            <ToggleButton value="Headers" className="w-24 h-6">
              {" "}
              Headers
            </ToggleButton>
          </ToggleButtonGroup>
          {section === "Status" && <StatusCodeSelector value={"200"} />}
          {section === "Body" && <BodySection body={""} />}
          {section === "Headers" && (
            <HeaderSection
              headers={[{ name: "Content-Type", value: "application/json" }]}
            />
          )}
        </div>
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
      { path: routes.API_KEYS, element: <APIKeys /> },
      { path: routes.LIVE, element: <LiveSnifferPage /> },
      { path: routes.SNIFFER, element: <SnifferPage /> },
      { path: routes.SNIFFER_ENDPOINT, element: <SnifferEndpointPage /> },
      {
        path: routes.SNIFFER_ENDPOINT_INVOCATION,
        element: <SnifferEndpointPage />,
      },
      {
        path: routes.SNIFFER_CREATE_INVOCATION,
        element: <CreateInvocationPage />,
      },
      { path: routes.LIVE_INVOCATION, element: <LiveSnifferPage /> },
      { path: routes.CHAT, element: <ChatPage /> },
      { path: routes.TEST_SUITES, element: <TestSuitePage /> },
      { path: routes.TEST_SUITE, element: <TestSuitePage /> },
      { path: routes.TEST_SUITE_TEST, element: <TestSuitePage /> },
      { path: routes.TEST_ENDPOINT, element: <TestSuitePage /> },
      { path: routes.MOCKS, element: <MockPage /> },
      { path: routes.MOCKS_SNIFFER, element: <MockPage /> },
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
                  {user ? <LiveSnifferPage /> : <LandingPage />}
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
