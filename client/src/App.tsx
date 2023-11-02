import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageTemplate } from "./components/page-template/page-template";
import { routes } from "./constants/routes";
import { RequestMetadataProvider } from "./context/requests-context";
import AuthUI from "./pages/auth/Auth";
import { InvocationEditor } from "./pages/invocation/invocation";
import { Requests } from "./pages/requests/requests";
import { ServiceRequest } from "./pages/service-request/service-request";
import { useThemeStore } from "./stores/themeStore";
import APIKeys from "./pages/api-keys/api-keys";
import { useAuthStore } from "./stores/authStore";
import SniffersPage from "./pages/sniffers/SniffersPage";
import { LandingPage } from "./LandingPage";
import { SharkioDocsGettingStartedPage } from "./pages/docs/SharkioDocsGettingStartedPage";
import { SharkioDocsSetupPage } from "./pages/docs/SharkioDocsSetupPage";
import { AuthWrapper } from "./AuthWrapper";

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
      { path: routes.SERVICE_REQUEST, element: <ServiceRequest /> },
      // { path: routes.COLLECTION_REQUEST, element: <CollectionRequest /> },
      { path: routes.REQUEST_INVOCATION, element: <InvocationEditor /> },
      { path: routes.API_KEYS, element: <APIKeys /> },
      { path: routes.REQUESTS, element: <Requests /> },
      { path: routes.SNIFFERS, element: <SniffersPage /> },

      // { path: routes.MOCKS, element: <MocksPage /> },
      // { path: routes.SERVICE, element: <Service /> },
      // { path: routes.MOCKS, element: <Mocks /> },
      // { path: routes.OPENAPI, element: <GenOpenAPI /> },
      // { path: routes.COLLECTION, element: <Collections /> },
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
          <RequestMetadataProvider>
            <Routes>
              {routesWithAuth()}
              <Route
                path={"*"}
                element={
                  <PageTemplate>
                    {user ? <SniffersPage /> : <LandingPage />}
                  </PageTemplate>
                }
              />
              <Route
                path={routes.DOCS_GETTINGS_STARTED}
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
          </RequestMetadataProvider>
        </BrowserRouter>
      </ThemeProvider>
    </AuthWrapper>
  );
}

export default App;
