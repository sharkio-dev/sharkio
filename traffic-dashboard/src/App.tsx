import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageTemplate } from "./components/page-template/page-template";
import { routes } from "./constants/routes";
import { RequestMetadataProvider } from "./context/requests-context";
import { Config } from "./pages/config/config";
import { GenOpenAPI } from "./pages/gen-openapi/gen-openapi";
import { Home } from "./pages/home/Home";
import { default as Mocks, default as MocksPage } from "./pages/mocks/mocks";
import { NewRequest } from "./pages/new-request/new-request";
import { RequestPage } from "./pages/request/request";
import { Requests } from "./pages/requests/requests";
import { Service } from "./pages/service/service";

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
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
              <Route path={routes.MOCKS} element={<Mocks />}></Route>
              <Route path={routes.OPENAPI} element={<GenOpenAPI />}></Route>
              <Route path={"*"} element={<Home />}></Route>
            </Routes>
          </PageTemplate>
        </RequestMetadataProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
