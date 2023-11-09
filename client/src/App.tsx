import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthWrapper } from "./AuthWrapper";
import { LandingPage } from "./LandingPage";
import { PageTemplate } from "./components/page-template/page-template";
import { routes } from "./constants/routes";
import APIKeys from "./pages/api-keys/api-keys";
import AuthUI from "./pages/auth/Auth";
import { SharkioDocsGettingStartedPage } from "./pages/docs/SharkioDocsGettingStartedPage";
import { SharkioDocsSetupPage } from "./pages/docs/SharkioDocsSetupPage";
import SniffersPage from "./pages/sniffers/SniffersPage";
import { useAuthStore } from "./stores/authStore";
import { useThemeStore } from "./stores/themeStore";
import { BsSend } from "react-icons/bs";
import { SiOpenai } from "react-icons/si";

const ChatPage = () => {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([
    {
      message: "Hello, how can I help you?",
      type: "bot",
    },
  ]);

  const onSendMessage = () => {
    const type = "user";
    setMessages([{ message, type }, ...messages]);
    setMessage("");
  };

  return (
    <div className="flex flex-col p-4 w-full items-center h-[calc(100%-56px)]">
      <div className="flex flex-col-reverse overflow-y-auto md:w-3/4 mb-4 h-full">
        {messages.length === 0 && <NoMessages />}
        {messages.reverse().map(({ message, type }, index) => {
          if (type === "bot") {
            return <BotMessage key={index} content={message} />;
          } else {
            return <UserMessage key={index} content={message} />;
          }
        })}
      </div>
      <div className="flex justify-center items-center border border-border-color rounded-2xl px-4 py-2 md:w-3/4">
        <input
          className="w-full bg-transparent border-none outline-none"
          placeholder="Type a question..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSendMessage();
            }
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div
          className="flex flex-row items-center justify-center bg-blue-300 rounded-lg h-8 w-8 hover:bg-blue-400 cursor-pointer active:bg-blue-500"
          onClick={onSendMessage}
        >
          <BsSend className="text-[#fff]" />
        </div>
      </div>
    </div>
  );
};

const BotMessage = ({ content }) => {
  return (
    <div className="flex flex-row items-center justify-start mb-4 ">
      <div className="flex flex-col items-start justify-start bg-blue-300 rounded-e-xl rounded-br-xl rounded-tl-xl p-2">
        <span className="text-tertiary text-sm">{content}</span>
      </div>
    </div>
  );
};

const UserMessage = ({ content }) => {
  return (
    <div className="flex flex-row items-center justify-end mb-4">
      <div className="flex flex-col items-end justify-start bg-gray-300 rounded-s-xl rounded-bl-xl rounded-tr-xl p-2">
        <span className="text-tertiary text-sm">{content}</span>
      </div>
    </div>
  );
};

const NoMessages = () => {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <SiOpenai className="text-gray-400 text-4xl mb-2" />
      <span className="text-gray-400 text-lg">
        Ask questions about your APIs
      </span>
    </div>
  );
};

function App(): React.JSX.Element {
  const { mode } = useThemeStore();
  const { user } = useAuthStore();

  const theme = createTheme({
    palette: {
      mode,
    },
  });

  const routesWithAuth = () => {
    const routesWithAuth = [
      { path: routes.API_KEYS, element: <APIKeys /> },
      { path: routes.LIVE, element: <SniffersPage /> },
      { path: routes.SNIFFER, element: <SniffersPage /> },
      { path: routes.SNIFFER_ENDPOINT, element: <SniffersPage /> },
      { path: routes.SNIFFER_ENDPOINT_INVOCATION, element: <SniffersPage /> },
      { path: routes.LIVE_INVOCATION, element: <SniffersPage /> },
      { path: routes.CHAT, element: <ChatPage /> },
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
    <AuthWrapper>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
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
              path={routes.DOCS_GETTING_STARTED}
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
        </BrowserRouter>
      </ThemeProvider>
    </AuthWrapper>
  );
}

export default App;
