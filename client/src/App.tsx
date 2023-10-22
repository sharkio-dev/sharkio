import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PageTemplate } from "./components/page-template/page-template";
import { routes } from "./constants/routes";
import { RequestMetadataProvider } from "./context/requests-context";
import AuthUI from "./pages/auth/Auth";
import { CollectionRequest } from "./pages/collection-request/collection-request";
import { Collections } from "./pages/collections/collections";
import { Config } from "./pages/config/config";
import { GenOpenAPI } from "./pages/gen-openapi/gen-openapi";
import { GettingStarted } from "./pages/getting-started.tsx/getting-started";
import { InvocationEditor } from "./pages/invocation/invocation";
import { default as Mocks, default as MocksPage } from "./pages/mocks/mocks";
import { Pricing } from "./pages/pricing/pricing";
import { Requests } from "./pages/requests/requests";
import { ServiceRequest } from "./pages/service-request/service-request";
import { Service } from "./pages/service/service";
import { useThemeStore } from "./stores/themeStore";
import { useAuthStore } from "./stores/authStore";
import { supabaseClient } from "./utils/supabase-auth";
import { setAuthCookie } from "./api/api";

function App(): React.JSX.Element {
  const { mode } = useThemeStore();
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
      { path: routes.COLLECTION_REQUEST, element: <CollectionRequest /> },
      { path: routes.REQUEST_INVOCATION, element: <InvocationEditor /> },
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
                  <GettingStarted />
                </PageTemplate>
              }
            />
            <Route
              path={"/getting-started"}
              element={
                <PageTemplate>
                  <GettingStarted />
                </PageTemplate>
              }
            />
            <Route
              path={"/pricing"}
              element={
                <PageTemplate>
                  <Pricing />
                </PageTemplate>
              }
            />
            <Route
              path={"/login"}
              element={
                <PageTemplate>
                  <AuthUI />
                </PageTemplate>
              }
            />
            <Route
              path={"/signup"}
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

export default App;
