import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthWrapper } from "./AuthWrapper";
import { LandingPage } from "./LandingPage";
import { PageTemplate } from "./components/page-template/page-template";
import { routes } from "./constants/routes";
import APIKeys from "./pages/api-keys/api-keys";
import AuthUI from "./pages/auth/Auth";
import { SharkioDocsGettingStartedPage } from "./pages/docs/SharkioDocsGettingStartedPage";
import { SharkioDocsSetupPage } from "./pages/docs/SharkioDocsSetupPage";
import SniffersPage, { LivePage } from "./pages/sniffers/SniffersPage";
import { useAuthStore } from "./stores/authStore";
import { useThemeStore } from "./stores/themeStore";

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
      { path: routes.LIVE, element: <LivePage /> },
      { path: routes.SNIFFER, element: <SniffersPage /> },
      { path: routes.SNIFFER_ENDPOINT, element: <SniffersPage /> },
      { path: routes.SNIFFER_ENDPOINT_INVOCATION, element: <SniffersPage /> },
      { path: routes.LIVE_INVOCATION, element: <LivePage /> },
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
    <AuthWrapper>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {routesWithAuth()}
            <Route
              path={"*"}
              element={
                <PageTemplate>
                  {user ? <LivePage /> : <LandingPage />}
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
        </BrowserRouter>
      </ThemeProvider>
    </AuthWrapper>
  );
}

export default App;
