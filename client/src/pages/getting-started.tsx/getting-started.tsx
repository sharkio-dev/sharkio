import { ArrowRight } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../constants/routes";

const Number: React.FC<{ number: number }> = ({ number }) => {
  return (
    <div className="flex-2 flex flex-col p-5 justify-center">
      <div className="w-8 h-8 font-bold text-gray-700 rounded-full bg-white flex items-center justify-center font-mono">
        {number}
      </div>
    </div>
  );
};

interface IGettingStartedCardProps {
  title: string;
  content: ReactElement;
  number: number;
  action?: () => void;
}

const GettingStartedCard: React.FC<IGettingStartedCardProps> = ({
  title,
  content,
  number,
  action,
}) => {
  return (
    <div className="h-full bg-secondary shadow-lg rounded-lg">
      <div className="py-2 flex h-full">
        <Number number={number} />
        <div className="">
          <div className="font-bold text-l mb-2">{title}</div>
          <p className="text-gray-400 text-base text-sm">{content}</p>
        </div>
        <div className="flex-1 flex flex-col px-5 justify-center w-full items-end">
          {action && (
            <div>
              <IconButton onClick={action}>
                <ArrowRight />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const GettingStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-[] p-4 flex-1">
      <div className="flex flex-col">
        <div className="flex w-full content-center justify-center font-bold text-xl mb-5">
          The best API development tool
        </div>
        <div className="flex w-full content-center justify-center font-bold text-l mb-10 text-center text-gray-400">
          Sharkio is a simple to use API proxy. Packed with many features that
          will change the way you develop API's. Sharkio records all the
          requests that are sent to your API. It allows you to replay and debug
          the requests easily. easily. Generate types, documentation, test
          suites, And interact with your API using AI.
          <br />
        </div>
        <div className="font-bold text-xl mb-5 flex w-full content-center justify-center">
          Getting started
        </div>
        <div
          className="
          grid
          grid-cols-1
          gap-2
          md:grid md:grid-rows-3 
          md:grid-cols-2 md:gap-2
          md:grid-flow-col"
        >
          <GettingStartedCard
            title={"Start you server"}
            content={
              <>
                Start your server and copy its address.
                <br />
                If you are starting the server on the local machine.
                <br />
                Use ngrok to expose your server.
              </>
            }
            number={1}
            action={undefined}
          />
          <GettingStartedCard
            title={"Setup a proxy"}
            content={
              <>
                Choose a port for the proxy. <br />
                Paste the address of the server into the downstream field.
                <br />
                Give the proxy a name (For example &quot;Backend&quot;)
                <br />
                Save and than start the proxy using the green play button
              </>
            }
            number={2}
            action={() => {
              navigate(routes.SNIFFERS);
            }}
          />
          <GettingStartedCard
            title={"View the traffic"}
            content={
              <>
                Watch all the traffic of your server
                <br />
                Search by request name
                <br />
                Filter by method and service
              </>
            }
            number={3}
            action={() => {
              navigate(routes.REQUESTS);
            }}
          />
          <GettingStartedCard
            title={"Create mocks"}
            content={
              <>
                Create mocks for your application.
                <br />
                Choose an endpoint. Either an existing one, or a new one.
                <br />
                Choose the status code of the response.
                <br />
                Insert the data you wish to return.
                <br />
                Save and start using the mocked endpoint.
              </>
            }
            number={4}
            action={() => {
              navigate(routes.MOCKS);
            }}
          />
          <GettingStartedCard
            title={"Get your openAPI schema"}
            content={
              <>
                Interact with your API using the integrated swagger tool.
                <br />
                Download or copy the openAPI schema sharkio generated for you
              </>
            }
            number={5}
            action={() => {
              navigate(routes.OPENAPI);
            }}
          />
          <GettingStartedCard
            title={"Organize in collections"}
            content={
              <>
                Organize all of your APIs in collections.
                <br /> Share them with you teammates.
              </>
            }
            number={6}
            action={() => {
              navigate(routes.COLLECTION);
            }}
          />
        </div>
      </div>
    </div>
  );
};
