import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageTemplate } from "./components/page-template/page-template";
import { routes } from "./constants/routes";
import { RequestMetadataProvider } from "./context/requests-context";
import AuthUI from "./pages/auth/Auth";
import { Collections } from "./pages/collections/collections";
import { Config } from "./pages/config/config";
import { GenOpenAPI } from "./pages/gen-openapi/gen-openapi";
import { Home } from "./pages/home/Home";
import { default as Mocks, default as MocksPage } from "./pages/mocks/mocks";
import { NewRequest } from "./pages/new-request/new-request";
import { Requests } from "./pages/requests/requests";
import { Service } from "./pages/service/service";
import { ServiceRequest } from "./pages/service-request/service-request";
import { CollectionRequest } from "./pages/collection-request/collection-request";
import { useThemeStore } from "./stores/themeStore";
import { About } from "./pages/about/about";

function App(): React.JSX.Element {
  const { mode } = useThemeStore();

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  const routesWithAuth = () => {
    const routesWithAuth = [
      { path: "/new-request", element: <NewRequest /> },
      { path: routes.SERVICE_REQUEST, element: <ServiceRequest /> },
      { path: routes.COLLECTION_REQUEST, element: <CollectionRequest /> },
      { path: routes.CONFIG, element: <Config /> },
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
    // <div id="app">
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
                  <About />
                </PageTemplate>
              }
            />
            <Route
              path={"/home"}
              element={
                <PageTemplate>
                  <About />
                </PageTemplate>
              }
            />
          </Routes>
        </RequestMetadataProvider>
      </ThemeProvider>
    </BrowserRouter>
    // </div>
  );
}

export default App;
