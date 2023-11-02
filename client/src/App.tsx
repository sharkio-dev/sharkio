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
import { TfiSettings } from "react-icons/tfi";
import { AiOutlinePlayCircle } from "react-icons/ai";

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
                  <SharkioDocsGettingStartedPage />
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

const SharkioDocsSetupPage = () => {
  return (
    <SharkioDocsPageTemplate
      title={"Setup Guide"}
      subTitle={
        "Learn how to set up Sharkio and start using it to develop your APIs."
      }
    >
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
    </SharkioDocsPageTemplate>
  );
};

const SharkioDocsGettingStartedPage = () => {
  return (
    <SharkioDocsPageTemplate
      title={"Getting Started"}
      subTitle={"Get started with Sharkio in 4 easy steps."}
    >
      <SharkioDocsSection title={"Start Your API"} sectionNumber={1}>
        Start your API service on your local machine.
      </SharkioDocsSection>

      <SharkioDocsSection title="Create a Sniffer" sectionNumber={2}>
        Create a sniffer (=Proxy) to monitor your API traffic by running the
        following command:
        <div className="flex flex-col w-full my-2">
          <CopyBlock
            language="bash"
            text={`sharkio create sniffer -p <port> -n <name>`}
            showLineNumbers={false}
            theme={a11yDark}
            wrapLines={true}
            codeBlock
          />
        </div>
        Port: The port your API is running on.{"\n"}
        Name: The name of your sniffer.
        <div className="text-lg font-serif mt-2">
          {"You'll"} be given a unique subdomain for your sniffer. This is where
          you will redirect your traffic to.
        </div>
      </SharkioDocsSection>

      <SharkioDocsSection title="Start Your Sniffer" sectionNumber={3}>
        Start your sniffer by running the following command:
        <div className="flex flex-col w-full my-2">
          <CopyBlock
            language="bash"
            text={`sharkio start sniffer`}
            showLineNumbers={false}
            theme={a11yDark}
            wrapLines={true}
            codeBlock
          />
        </div>
      </SharkioDocsSection>

      <SharkioDocsSection
        title="Redirect Other Services to Subdomain"
        sectionNumber={4}
      >
        Redirect your all the services that communicate with your API to the new
        subdomain.{"\n"}
        Now you can open the Sharkio dashboard and start building faster.
      </SharkioDocsSection>
    </SharkioDocsPageTemplate>
  );
};

type SharkioDocsSectionProps = {
  title: string;
  children: React.ReactNode;
  sectionNumber?: number;
};

const SharkioDocsSection = ({
  title,
  children,
  sectionNumber,
}: SharkioDocsSectionProps) => {
  return (
    <section className="flex flex-col mb-8">
      <div className="flex w-full flex-row mb-2">
        <div className="flex text font-serif bg-blue-200 px-2 rounded-lg border-blue-200 border-2 bg-opacity-40 mr-4">
          {sectionNumber ? `${sectionNumber}` : 1}
        </div>
        <div className="text-xl font-bold whitespace-pre-line">{title}</div>
      </div>
      <div className="text-lg font-serif mb-4 text-[#717171] whitespace-pre-line">
        {children}
      </div>
    </section>
  );
};

const SharkioDocsNavigation = () => {
  return (
    <div className="flex h-full flex-col w-1/5 border-r bg-secondary border-border-color hidden sm:inline-flex ">
      <div className="flex text-lg font-serif text-center items-center border-b border-border-color hover:cursor-pointer hover:bg-tertiary">
        <div className="flex flex-1 active:scale-105 px-4 py-2">
          <TfiSettings className="w-6 h-6 mr-2" />
          Setup
        </div>
      </div>
      <div className="flex text-lg font-serif text-center items-center border-b border-border-color hover:cursor-pointer hover:bg-tertiary">
        <div className="flex flex-1 active:scale-105 px-4 py-2">
          <AiOutlinePlayCircle className="w-6 h-6 mr-2" />
          Getting Started
        </div>
      </div>
    </div>
  );
};

type SharkioDocsPageTemplateProps = {
  title: string;
  subTitle: string;
  children: React.ReactNode;
};

const SharkioDocsPageTemplate = ({
  children,
  title,
  subTitle,
}: SharkioDocsPageTemplateProps) => {
  return (
    <div className="flex flex-row w-full h-full">
      <SharkioDocsNavigation />
      <div className="p-4 flex flex-col flex-1">
        <div className="flex text-4xl font-serif ">{title}</div>
        <div className="flex w-full border-b border-border-color my-6"></div>
        <div className="text-lg font-serif mb-4 text-[#717171]">{subTitle}</div>

        <div className="flex flex-col flex-1 p-4">{children}</div>
      </div>
    </div>
  );
};
export default App;
