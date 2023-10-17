import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageTemplate } from "./components/page-template/page-template";
import { routes } from "./constants/routes";
import { RequestMetadataProvider } from "./context/requests-context";
import AuthUI from "./pages/auth/Auth";
import { CollectionRequest } from "./pages/collection-request/collection-request";
import { Collections } from "./pages/collections/collections";
import { Config } from "./pages/config/config";
import { GenOpenAPI } from "./pages/gen-openapi/gen-openapi";
import { GettingStarted } from "./pages/getting-started.tsx/getting-started";
import { InvocationEditor } from "./pages/invocation/invocation";
import { default as Mocks, default as MocksPage } from "./pages/mocks/mocks";
import { Pricing } from "./pages/pricing/pricing";
import { Requests } from "./pages/requests/requests";
import { ServiceRequest } from "./pages/service-request/service-request";
import { Service } from "./pages/service/service";
import { useThemeStore } from "./stores/themeStore";
import Footer from "./components/footer/footer";
import APIKeys from "./pages/api-keys/api-keys";

function App(): React.JSX.Element {
  const { mode } = useThemeStore();

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  const routesWithAuth = () => {
    const routesWithAuth = [
      { path: routes.SERVICE_REQUEST, element: <ServiceRequest /> },
      { path: routes.COLLECTION_REQUEST, element: <CollectionRequest /> },
      { path: routes.REQUEST_INVOCATION, element: <InvocationEditor /> },
      { path: routes.CONFIG, element: <Config /> },
      { path: routes.API_KEYS, element: <APIKeys /> },
      { path: routes.REQUESTS, element: <Requests /> },
      { path: routes.MOCKS, element: <MocksPage /> },
      { path: routes.SERVICE, element: <Service /> },
      { path: routes.MOCKS, element: <Mocks /> },
      { path: routes.OPENAPI, element: <GenOpenAPI /> },
      { path: routes.COLLECTION, element: <Collections /> },
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
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RequestMetadataProvider>
          <Routes>
            {routesWithAuth()}
            <Route
              path={"*"}
              element={
                <PageTemplate>
                  <GettingStarted />
                  <AuthUI />
                  <Footer />
                </PageTemplate>
              }
            />
            <Route
              path={"/getting-started"}
              element={
                <PageTemplate>
                  <GettingStarted />
                </PageTemplate>
              }
            />
            <Route
              path={"/pricing"}
              element={
                <PageTemplate>
                  <Pricing />
                </PageTemplate>
              }
            />
            <Route
              path={"/login"}
              element={
                <PageTemplate>
                  <AuthUI />
                </PageTemplate>
              }
            />
            <Route
              path={"/signup"}
              element={
                <PageTemplate>
                  <AuthUI />
                </PageTemplate>
              }
            />
          </Routes>
        </RequestMetadataProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
