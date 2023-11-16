import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React, { useEffect } from "react";
import { CodeBlock, dracula } from "react-code-blocks";
import { BsSend } from "react-icons/bs";
import { SiOpenai } from "react-icons/si";
import ReactMarkdown from "react-markdown";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import { AuthWrapper } from "./AuthWrapper";
import { LandingPage } from "./LandingPage";
import { loadChat, newChat, newMessage } from "./api/api";
import { PageTemplate } from "./components/page-template/page-template";
import { routes } from "./constants/routes";
import APIKeys from "./pages/api-keys/api-keys";
import AuthUI from "./pages/auth/Auth";
import { SharkioDocsGettingStartedPage } from "./pages/docs/SharkioDocsGettingStartedPage";
import { SharkioDocsSetupPage } from "./pages/docs/SharkioDocsSetupPage";
import { LoadingIcon } from "./pages/sniffers/LoadingIcon";
import SniffersPage from "./pages/sniffers/SniffersPage";
import { useAuthStore } from "./stores/authStore";
import { useThemeStore } from "./stores/themeStore";

const ChatPage = () => {
  const { chatId: paramChatId } = useParams();
  const [chatId, setChatId] = React.useState(paramChatId);
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([
    {
      message:
        'Hello, how can I help you?   \n ```console.log("hello world") ``` \n',
      type: "bot",
    },
  ]);
  const [isThinking, setIsThinking] = React.useState(false);

  useEffect(() => {
    if (chatId != null) {
      loadChat(chatId);
    }
  }, [chatId]);

  const onSendMessage = () => {
    const type = "user";
    setMessages((prevMessages) => {
      return [...prevMessages, { message, type }];
    });
    setMessage("");
    setIsThinking(true);

    if (messages.length === 1) {
      newChat(message)
        .then((res: any) => {
          setMessages((prevMessages) => {
            return [
              ...prevMessages,
              { message: res.data.content, type: "bot" },
            ];
          });
          setChatId(res.data.chatId);
        })
        .finally(() => setIsThinking(false));
    } else {
      if (chatId != null) {
        newMessage(chatId, message)
          .then((res: any) => {
            setMessages((prevMessages) => {
              return [
                ...prevMessages,
                { message: res.data.content, type: "bot" },
              ];
            });
          })
          .finally(() => {
            setIsThinking(false);
          });
      }
    }
  };

  return (
    <div className="flex flex-col p-4 w-full items-center h-[calc(100%-56px)]">
      <div
        className="flex flex-col overflow-y-auto mb-4 h-full w-full
        pl-[12.5%] pr-[12.5%]"
      >
        {messages.length === 0 && <NoMessages />}
        {messages.map(({ message, type }, index) => {
          if (type === "bot") {
            return <BotMessage key={index} content={message} />;
          } else {
            return <UserMessage key={index} content={message} />;
          }
        })}
        {isThinking && <ThinkingMessage content={"..."} />}
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
          {isThinking ? <LoadingIcon /> : <BsSend className="text-[#fff]" />}
        </div>
      </div>
    </div>
  );
};

const ThinkingMessage = ({ content }: any) => {
  return (
    <div className="flex flex-row items-center justify-start mb-4 ">
      <div className="flex flex-col items-start justify-start bg-blue-400 rounded-e-xl rounded-br-xl rounded-tl-xl p-2">
        <span className="text-tertiary text-sm">{content}</span>
      </div>
    </div>
  );
};

const BotMessage = ({ content }: any) => {
  return (
    <div className="flex flex-row items-center justify-start mb-4 whitespace-pre-wrap">
      <div className="flex flex-col items-start justify-start bg-blue-300 rounded-e-xl rounded-br-xl rounded-tl-xl p-2">
        <ReactMarkdown
          components={{
            code: (props) => {
              const { children } = props;
              return (
                <CodeBlock
                  text={children?.toString() ?? ""}
                  language={""}
                  theme={dracula}
                  showLineNumbers={false}
                />
              );
            },
          }}
          className="text-tertiary text-sm"
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

const UserMessage = ({ content }: any) => {
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
