import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigation,
  useParams,
  useResolvedPath,
} from "react-router-dom";
import { PageTemplate } from "./components/page-template/page-template";
import { routes } from "./constants/routes";
import { RequestMetadataProvider } from "./context/requests-context";
import AuthUI from "./pages/auth/Auth";
import { InvocationEditor } from "./pages/invocation/invocation";
import { Requests } from "./pages/requests/requests";
import { ServiceRequest } from "./pages/service-request/service-request";
import { useThemeStore } from "./stores/themeStore";
import APIKeys from "./pages/api-keys/api-keys";
import { useAuthStore } from "./stores/authStore";
import { supabaseClient } from "./utils/supabase-auth";
import { setAuthCookie } from "./api/api";
import SniffersPage from "./pages/sniffers/SniffersPage";
import { LandingPage } from "./LandingPage";
import { SharkioDocsGettingStartedPage } from "./pages/docs/SharkioDocsGettingStartedPage";
import { SharkioDocsSetupPage } from "./pages/docs/SharkioDocsSetupPage";

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
              path={routes.DOCS_GETTINGS_STARTED}
              element={
                <PageTemplate isSideBar={false}>
                  <SharkioDocsGettingStartedPage />
                </PageTemplate>
              }
            />
            <Route
              path={routes.DOCS_SETUP}
              element={
                <PageTemplate isSideBar={false}>
                  <SharkioDocsSetupPage />
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

export default App;
