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

function App(): React.JSX.Element {
  const { mode } = useThemeStore();

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthUI>
          <RequestMetadataProvider>
            <PageTemplate>
              <Routes>
                <Route path={routes.HOME} element={<Home />} />
                <Route path="/new-request" element={<NewRequest />} />
                <Route
                  path={routes.SERVICE_REQUEST}
                  element={<ServiceRequest />}
                />
                <Route
                  path={routes.COLLECTION_REQUEST}
                  element={<CollectionRequest />}
                />
                <Route path={routes.CONFIG} element={<Config />} />
                <Route path={routes.REQUESTS} element={<Requests />} />
                <Route path={routes.MOCKS} element={<MocksPage />} />
                <Route path={routes.SERVICE} element={<Service />} />
                <Route path={routes.MOCKS} element={<Mocks />} />
                <Route path={routes.OPENAPI} element={<GenOpenAPI />} />
                <Route path={routes.COLLECTION} element={<Collections />} />
                <Route path={"*"} element={<AuthUI />} />
              </Routes>
            </PageTemplate>
          </RequestMetadataProvider>
        </AuthUI>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
