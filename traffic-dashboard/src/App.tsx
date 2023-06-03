import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageTemplate } from "./components/page-template/page-template";
import { routes } from "./constants/routes";
import { RequestMetadataProvider } from "./context/requests-context";
import { Home } from "./pages/home/Home";
import { NewRequest } from "./pages/new-request/new-request";
import { RequestPage } from "./pages/request/request";
import { Config } from "./pages/config/Config";

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
            </Routes>
          </PageTemplate>
        </RequestMetadataProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
