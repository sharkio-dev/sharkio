import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import { InvocationScreen, LivePage } from "./pages/live-Invocations/LivePage";
import { HomePage } from "./pages/sniffers/HomePage";
import { AddSnifferPage } from "./pages/sniffers/AddSnifferPage";
import { FullStory } from "@fullstory/browser";
import { useSniffersStore } from "./stores/sniffersStores";
import { JoinWorkspace } from "./components/project-selection/JoinWorkspace";
import FlowPage, { FlowStepPage } from "./pages/flows/flowPage";

function App(): React.JSX.Element {
  const { mode } = useThemeStore();

  const { user } = useAuthStore();
  const { loadSniffers } = useSniffersStore();

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  useEffect(() => {
    if (import.meta.env.VITE_FULLSTORY_ORG_ID) {
      FullStory("setProperties", {
        type: "user",
        properties: {
          email: user?.email,
          id: user?.id,
        },
      });
    }
    if (user && user.id) {
      loadSniffers();
    }
  }, [user]);

  const routesWithAuth = () => {
    const routesWithAuth = [
      { path: routes.PROXIES, element: <HomePage /> },
      { path: routes.PROXY_CREATE, element: <AddSnifferPage /> },
      { path: routes.API_KEYS, element: <APIKeys /> },
      { path: routes.LIVE_INVOCATIONS, element: <LivePage /> },
      { path: routes.ENDPOINTS, element: <SnifferPage /> },
      { path: routes.ENDPOINT, element: <SnifferEndpointPage /> },
      { path: routes.ENDPOINTS_INVOCATION, element: <SnifferEndpointPage /> },
      {
        path: routes.CREATE_ENDPOINT,
        element: <CreateInvocationPage />,
      },
      { path: routes.LIVE_INVOCATION, element: <InvocationScreen /> },
      { path: routes.CHAT, element: <ChatPage /> },
      { path: routes.TEST_SUITES, element: <TestSuitePage /> },
      { path: routes.TEST_SUITE, element: <TestSuitePage /> },
      { path: routes.TEST_SUITE_TEST, element: <TestSuitePage /> },
      { path: routes.FLOWS, element: <FlowPage /> },
      { path: routes.FLOW, element: <FlowPage /> },
      { path: routes.FLOW_TEST, element: <FlowStepPage /> },
      { path: routes.MOCKS, element: <MockPage /> },
      { path: routes.MOCK, element: <MockPage /> },
      { path: routes.JOIN_WORKSPACE, element: <JoinWorkspace /> },
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
                <>
                  {user ? (
                    <PageTemplate withSideBar={true} withBottomBar={true}>
                      <HomePage />
                    </PageTemplate>
                  ) : (
                    <PageTemplate withSideBar={false} withBottomBar={true}>
                      <LandingPage />
                    </PageTemplate>
                  )}
                </>
              }
            />
            <Route
              path={routes.DOCS_GETTING_STARTED}
              element={
                <PageTemplate withSideBar={false}>
                  <SharkioDocsGettingStartedPage />
                </PageTemplate>
              }
            />
            <Route
              path={routes.DOCS_SETUP}
              element={
                <PageTemplate withSideBar={false}>
                  <SharkioDocsSetupPage />
                </PageTemplate>
              }
            />
            <Route
              path={routes.LOGIN}
              element={
                <PageTemplate withBottomBar={true} withSideBar={false}>
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
