import { ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageTemplate } from "./components/page-template/page-template";
import { RequestsCard } from "./components/requests-card/requests-card";

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <PageTemplate>
          <Routes>
            <Route path="/home" element={<RequestsCard />}></Route>
            <Route path="/new-request" element={<></>}></Route>
            <Route path="*"></Route>
          </Routes>
        </PageTemplate>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
