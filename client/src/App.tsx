import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
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
import { a11yDark, CopyBlock } from "react-code-blocks";

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
                  <SharkioDocs />
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
            className="flex bg-blue-200 rounded-lg p-2 shadow-sm items-center w-40 justify-center hover:scale-105 hover:cursor-pointer active:scale-95 text-border-color text-lg font-bold font-mono"
            onClick={() => navigate(routes.LOGIN)}
          >
            Login
          </div>
        </div>
      </div>
    </div>
  );
};

const SharkioDocs = () => {
  return (
    <div className="flex flex-row w-full h-full">
      <div className="flex h-full flex-col w-1/5 border-r border-border-color hidden sm:inline-flex ">
        <div className="flex text-2xl font-bold font-mono mb-4 text-center bg-secondary p-2 px-4 rounded-lg">
          Setup
        </div>
        <div className="flex text-2xl font-bold font-mono mb-4 text-center bg-secondary p-2 px-4 rounded-lg">
          Usage
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex text-4xl font-mono ">Setup Guide</div>
        <div className="flex w-full border-b border-border-color my-6"></div>
        <div className="text-lg font-mono mb-4 text-[#717171]">
          Learn how to set up Sharkio and start using it to develop your APIs.
        </div>

        <div className="flex flex-col flex-1 p-4">
          <SharkioDocsSection title="Sign Up" sectionNumber={1}>
            Head to the{" "}
            <a href="https://sharkio.dev" className="hover:text-blue-200">
              Sharkio website.
            </a>
            <img
              src="login.png"
              alt=""
              className="w-full rounded-lg h-96 border-2 border-border-color mt-4"
            />
          </SharkioDocsSection>

          <SharkioDocsSection title="Generate an API Token" sectionNumber={2}>
            <p>
              Access the{" "}
              <a
                href="https://sharkio.dev/api-keys"
                className="hover:text-blue-200"
              >
                API Keys page
              </a>{" "}
              by clicking on your profile picture and generate a token.
            </p>
            <img
              src="apiKeys.png"
              alt=""
              className="w-full rounded-lg h-96 border-2 border-border-color mt-4"
            />
          </SharkioDocsSection>

          <SharkioDocsSection title="Install Sharkio-cli" sectionNumber={3}>
            Install the Sharkio-cli.
            <div className="flex flex-col w-full mt-2">
              <CopyBlock
                language="bash"
                text={`npm i -g sharkio-cli`}
                showLineNumbers={false}
                theme={a11yDark}
                wrapLines={true}
                codeBlock
              />
            </div>
          </SharkioDocsSection>

          <SharkioDocsSection title="Sharkio Login" sectionNumber={4}>
            Login to Sharkio-cli, the session will be saved in your home folder.
            <div className="flex flex-col w-full my-2">
              <CopyBlock
                language="bash"
                text={`sharkio login`}
                showLineNumbers={false}
                theme={a11yDark}
                wrapLines={true}
                codeBlock
              />
            </div>
            {"You'll"} be prompted to enter your email and the precious token{" "}
            {"you've "}secured.
          </SharkioDocsSection>
          {/* 
          <div className="flex text-2xl font-bold font-mono mb-4 text-center bg-secondary p-2 px-4 rounded-lg">
            Usage
          </div>

          <SharkioDocsSection title={"1. Start Your API 🚦"}>
            <p>
              Set sail and start the APIs you want to use Sharkio with as a
              proxy. Sharkio will act as your sonar, recording all the traffic
              and redirecting it back to the APIs.
            </p>
          </SharkioDocsSection>

          <SharkioDocsSection title="2. Create Sniffer to Your API 🕵️‍♂️">
            <p>
              Time to deploy your sniffer - your very own submarine for
              exploring the ocean of HTTP traffic. Execute the following
              command, giving your sniffer a name and assigning it a port:
            </p>
            <pre>
              <code>
                sharkio create sniffer -p {"<port>"} -n {"<name>"}
              </code>
            </pre>
          </SharkioDocsSection>

          <SharkioDocsSection title="3. Start Your Sniffer 🚀">
            <p>
              With this command, {"you'll"} launch your sniffer into the depths:
            </p>
            <pre>
              <code>sharkio start sniffer</code>
            </pre>
            <p>
              This creates an underwater tunnel using ngrok, channeling the
              traffic from the proxy to the tunnel and then to the local API.
              Watch as the data flows like a current through your sniffer.
            </p>
          </SharkioDocsSection>

          <SharkioDocsSection title="4. Redirect Other Services to Subdomain 🔀">
            <p>
              In the final leg of your journey, redirect other services to the
              {"proxy's"} subdomain by adjusting the .env variable. This ensures
              all traffic flows through Sharkio, allowing you to monitor every
              ripple and wave.
            </p>
          </SharkioDocsSection> */}
        </div>
      </div>
    </div>
  );
};

const SharkioDocsSection = ({ title, children, sectionNumber }) => {
  return (
    <section className="flex flex-col mb-8">
      <div className="flex w-full flex-row mb-2">
        <div className="flex text font-mono bg-blue-200 px-2 rounded-lg border-blue-200 border-2 bg-opacity-40 mr-4">
          {sectionNumber ? `${sectionNumber}` : 1}
        </div>
        <div className="text-xl font-bold whitespace-pre-line">{title}</div>
      </div>
      <div className="text-lg font-mono mb-4 text-[#717171] whitespace-pre-line">
        {children}
      </div>
    </section>
  );
};

const DocsNavigation = () => {
  return (
    <div className="flex flex-col w-1/4 p-4">
      <div className="flex text-2xl font-bold font-mono mb-4 text-center bg-secondary p-2 px-4 rounded-lg">
        Setup
      </div>
      <div className="flex text-2xl font-bold font-mono mb-4 text-center bg-secondary p-2 px-4 rounded-lg">
        Usage
      </div>
    </div>
  );
};

export default App;
