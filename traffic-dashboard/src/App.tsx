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
    <ThemeProvider theme={theme}>
      <PageTemplate>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<RequestsCard />}></Route>
          </Routes>
        </BrowserRouter>
      </PageTemplate>
    </ThemeProvider>
  );
}

export default App;
