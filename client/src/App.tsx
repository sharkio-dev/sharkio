import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { PageTemplate } from "./components/page-template/page-template";
import { routes } from "./constants/routes";
import { RequestMetadataProvider } from "./context/requests-context";
import AuthUI from "./pages/auth/Auth";
import { GettingStarted } from "./pages/getting-started.tsx/getting-started";
import { InvocationEditor } from "./pages/invocation/invocation";
import { Requests } from "./pages/requests/requests";
import { ServiceRequest } from "./pages/service-request/service-request";
import { useThemeStore } from "./stores/themeStore";
import APIKeys from "./pages/api-keys/api-keys";
import { useAuthStore } from "./stores/authStore";
import { supabaseClient } from "./utils/supabase-auth";
import { setAuthCookie } from "./api/api";
import SniffersPage from "./pages/sniffers/SniffersPage";

function App(): React.JSX.Element {
  const { mode } = useThemeStore();
  const { user } = useAuthStore();

  const { signIn } = useAuthStore();

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session == null) {
        return;
      }
      const userDetails = session?.user.user_metadata;

      signIn({
        id: session?.user.id ?? "",
        fullName: userDetails?.full_name,
        email: userDetails?.email,
        profileImg: userDetails?.avatar_url,
      });
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setAuthCookie(
        session ? event : "SIGNED_OUT", // Sign the user out if the session is null (ignore other events)
        session,
      ).then((res) => {
        if (!res.ok) return;
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  const routesWithAuth = () => {
    const routesWithAuth = [
      { path: routes.SERVICE_REQUEST, element: <ServiceRequest /> },
      // { path: routes.COLLECTION_REQUEST, element: <CollectionRequest /> },
      { path: routes.REQUEST_INVOCATION, element: <InvocationEditor /> },
      { path: routes.API_KEYS, element: <APIKeys /> },
      { path: routes.REQUESTS, element: <Requests /> },
      { path: routes.SNIFFERS, element: <SniffersPage /> },

      // { path: routes.MOCKS, element: <MocksPage /> },
      // { path: routes.SERVICE, element: <Service /> },
      // { path: routes.MOCKS, element: <Mocks /> },
      // { path: routes.OPENAPI, element: <GenOpenAPI /> },
      // { path: routes.COLLECTION, element: <Collections /> },
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
                  {user ? <SniffersPage /> : <LandingPage />}
                </PageTemplate>
              }
            />
            <Route
              path={routes.DOCS}
              element={
                <PageTemplate>
                  <GettingStarted />
                </PageTemplate>
              }
            />
            <Route
              path={routes.LOGIN}
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

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-1 items-center justify-center"
      style={{
        background: `linear-gradient(to right, #181818, #2d2d2d, #181818)`,
      }}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="text-white text-4xl font-bold font-mono">
          <div>Sharkio</div>
          <div className="text-2xl font-normal">API Development Made Easy.</div>
        </div>
        <div className="flex flex-row mt-4 w-full justify-between">
          <div
            className="flex border-blue-200 border-2 rounded-lg p-2 items-center w-40 justify-center hover:scale-105 hover:cursor-pointer active:scale-95 text-white text-lg font-bold font-mono"
            onClick={() => navigate(routes.DOCS)}
          >
            Get Started
          </div>

          <div
            className="flex bg-blue-200 rounded-lg p-2 shadow-sm items-center w-40 justify-center hover:scale-105 hover:cursor-pointer active:scale-95 text-[#3a3a3a] text-lg font-bold font-mono"
            onClick={() => navigate(routes.LOGIN)}
          >
            Login
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
