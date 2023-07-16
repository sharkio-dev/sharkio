import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageTemplate } from "./components/page-template/page-template";
import { routes } from "./constants/routes";
import { RequestMetadataProvider } from "./context/requests-context";
import { GenOpenAPI } from "./pages/gen-openapi/gen-openapi";
import React, { Suspense } from "react";

const Home = React.lazy(() => import("./pages/home/Home"));
const MocksPage = React.lazy(() => import("./pages/mocks/mocks"));
const NewRequest = React.lazy(() => import("./pages/new-request/new-request"));
const RequestPage = React.lazy(() => import("./pages/request/request"));
const Service = React.lazy(() => import("./pages/service/service"));
const Config = React.lazy(() => import("./pages/config/config"));
const Requests = React.lazy(() => import("./pages/requests/requests"));

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <RequestMetadataProvider>
            <PageTemplate>
              <Routes>
                <Route path={routes.HOME} element={<Home />} />
                <Route path="/new-request" element={<NewRequest />}></Route>
                <Route path={routes.REQUEST} element={<RequestPage />}></Route>
                <Route path={routes.CONFIG} element={<Config />}></Route>
                <Route path={routes.REQUESTS} element={<Requests />}></Route>
                <Route path={routes.MOCKS} element={<MocksPage />}></Route>
                <Route path={routes.SERVICE} element={<Service />}></Route>
                <Route path={routes.OPENAPI} element={<GenOpenAPI />}></Route>
                <Route path={"*"} element={<Home />}></Route>
              </Routes>
            </PageTemplate>
          </RequestMetadataProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
