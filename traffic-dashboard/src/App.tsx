import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageTemplate } from "./components/page-template/page-template";
import { RequestsCard } from "./components/requests-card/requests-card";
import { ConfigCard } from "./components/config-card/config-card";
import { Home } from "./pages/home/Home";
import { NewRequest } from "./pages/new-request/new-request";
import { RequestMetadataProvider } from "./context/requests-context";
import { RequestPage } from "./pages/request/request";
import { routes } from "./constants/routes";

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
              <Route path={routes.HOME} element={<Home />} />
            </Routes>
          </PageTemplate>
        </RequestMetadataProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
