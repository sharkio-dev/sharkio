import {
  Button,
  CssBaseline,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
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
  useLocation,
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
import { useMockStore } from "./stores/mockStore";
import { SelectComponent } from "./pages/test-suites/SelectComponent";
import { AiOutlinePlus } from "react-icons/ai";
import { selectIconByMethod } from "./pages/sniffers/selectIconByMethod";
import queryString from "query-string";

const MockSideBar = () => {
  const location = useLocation();
  const { snifferId, isNew } = queryString.parse(location.search);
  const { sniffers, loadSniffers } = useSniffersStore();
  const { mocks, loadMocks, resetMocks } = useMockStore();
  const { mockId } = useParams();
  const navigator = useNavigate();

  useEffect(() => {
    loadSniffers(true);
  }, []);

  useEffect(() => {
    if (snifferId) {
      loadMocks(snifferId as string);
    } else {
      resetMocks();
    }
  }, [snifferId]);

  return (
    <div className="flex flex-col justify-between items-center px-2 pt-4 space-y-4 h-[calc(vh-96px)] max-h-[calc(vh-96px)] overflow-y-auto">
      <FormControl fullWidth size="small" variant="outlined">
        <InputLabel>Sniffers</InputLabel>
        <Select value={snifferId} label="Sniffers">
          {sniffers.map((sniffer, i) => (
            <MenuItem
              key={i}
              value={sniffer.id}
              onClick={() => {
                let params = new URLSearchParams();
                params.append("snifferId", sniffer.id);
                let queryString = params.toString();
                navigator(`/mocks?${queryString}`);
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
      {snifferId && (
        <div className="flex flex-col w-full overflow-y-auto">
          <div
            className={`flex flex-row w-full hover:bg-primary  cursor-pointer active:bg-tertiary items-center rounded-md p-2
          ${isNew ? "bg-primary" : ""}`}
            onClick={() => {
              let params = new URLSearchParams();
              params.append("isNew", "true");
              params.append("snifferId", snifferId?.toString() || "");
              let queryString = params.toString();
              navigator(`/mocks?${queryString}`);
            }}
          >
            <div
              className={`flex text-sm max-w-full overflow-ellipsis whitespace-nowrap items-center`}
            >
              <AiOutlinePlus className="text-blue-500 h-8 w-8 p-1 mr-4" />
              New
            </div>
          </div>
          {mocks.map((mock, i) => (
            <div
              className={`flex flex-row w-full hover:bg-primary p-2 cursor-pointer active:bg-tertiary items-center rounded-md space-x-4 justify-between
            ${mock.id === mockId ? "bg-primary" : ""}`}
              onClick={() => {
                let params = new URLSearchParams();
                params.append("snifferId", snifferId?.toString() || "");
                navigator(`/mocks/${mock.id}?${params.toString()}`);
              }}
            >
              <div className="flex flex-row items-center space-x-2">
                {selectIconByMethod(mock.method)}
                <div className="flex text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
                  {mock.url}
                </div>
              </div>
              <Switch checked={mock.isActive} size="small" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MockMainSection = () => {
  const [section, setSection] = React.useState<"Status" | "Body" | "Headers">(
    "Body"
  );
  const { mocks } = useMockStore();
  const { mockId } = useParams();
  const location = useLocation();
  const { isNew } = queryString.parse(location.search);
  const [editedMock, setEditedMock] = React.useState({
    method: "GET",
    url: "",
    status: "200",
    headers: {},
    body: "",
  });

  useEffect(() => {
    if (mockId) {
      const mock = mocks.find((mock) => mock.id === mockId);
      if (!mock) return;
      setEditedMock({
        method: mock.method,
        url: mock.url,
        status: mock.status,
        headers: mock.headers,
        body: mock.body,
      });
    }
    if (isNew) {
      setEditedMock({
        method: "GET",
        url: "",
        status: "200",
        headers: {},
        body: "",
      });
    }
  }, [mockId, isNew]);

  return (
    <>
      <div className="flex flex-row items-center space-x-4">
        <div className="flex flex-row items-center w-40">
          <SelectComponent
            options={[
              { value: "GET", label: "GET" },
              { value: "POST", label: "POST" },
              { value: "PUT", label: "PUT" },
              { value: "PATCH", label: "PATCH" },
              { value: "DELETE", label: "DELETE" },
            ]}
            title="Method"
            value={editedMock.method || ""}
            setValue={(value) => {
              setEditedMock((prev) => ({ ...prev, method: value }));
            }}
          />
        </div>
        <TextField
          value={editedMock.url || ""}
          onChange={(e: any) => {
            setEditedMock((prev) => ({ ...prev, url: e.target.value }));
          }}
          variant="outlined"
          size="small"
          style={{ width: "100%" }}
        />
        <Button variant="contained" color="primary">
          {isNew ? "Create" : "Save"}
        </Button>
      </div>
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
        {section === "Status" && (
          <StatusCodeSelector
            value={editedMock.status || ""}
            setValue={(value) => {
              setEditedMock((prev) => ({ ...prev, status: value }));
            }}
          />
        )}
        {section === "Body" && (
          <BodySection
            body={editedMock.body || ""}
            setBody={(value) => {
              setEditedMock((prev) => ({ ...prev, body: value }));
            }}
          />
        )}
        {section === "Headers" && (
          <HeaderSection
            headers={Object.entries(editedMock.headers || {}).map(
              ([key, value]) => ({ name: key, value })
            )}
            setHeaders={(value) => {
              setEditedMock((prev) => ({ ...prev, headers: value }));
            }}
            addHeader={(header) => {
              setEditedMock((prev) => ({
                ...prev,
                headers: {
                  ...prev.headers,
                  [header.name]: header.value,
                },
              }));
            }}
          />
        )}
      </div>
    </>
  );
};

const MockPage = () => {
  const { mockId } = useParams();
  const location = useLocation();
  const { isNew } = queryString.parse(location.search);

  return (
    <div className={`flex h-full flex-row w-[calc(100vw-56px)]`}>
      <div className="flex flex-col h-full min-w-[240px] w-[240px] border-r border-border-color bg-secondary">
        <MockSideBar />
      </div>

      <div className="flex flex-col max-h-[calc(100vh-96px)] w-[calc(100vw-56px-240px)] p-4 space-y-4 overflow-y-auto">
        {(mockId || isNew) && <MockMainSection />}
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
