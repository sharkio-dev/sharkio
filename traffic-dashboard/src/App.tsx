import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageTemplate } from "./components/page-template/page-template";
import { routes } from "./constants/routes";
import { RequestMetadataProvider } from "./context/requests-context";
import { Home } from "./pages/home/Home";
import { NewRequest } from "./pages/new-request/new-request";
import { RequestPage } from "./pages/request/request";
import { Config } from "./pages/config/config";
import Mocks from "./pages/mocks/mocks";
import { Requests } from "./pages/requests/requests";

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
              <Route path={routes.MOCKS} element={<Mocks />}></Route>
              <Route path={"*"} element={<Home />}></Route>
            </Routes>
          </PageTemplate>
        </RequestMetadataProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
