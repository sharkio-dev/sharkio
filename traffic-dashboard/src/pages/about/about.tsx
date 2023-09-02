import { ArrowRight } from "@mui/icons-material";
import { Card, IconButton } from "@mui/material";
import React from "react";
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
  content: string;
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
    <>
      <Card className="mb-2">
        <div className="px-1 py-5 flex ">
          <Number number={number} />
          <div className="">
            <div className="font-bold text-xl mb-2">{title}</div>
            <p className="text-gray-400 text-base">{content}</p>
          </div>
          <div className="flex-1 flex flex-col p-5 justify-center w-full items-end">
            {action && (
              <div>
                <IconButton onClick={action}>
                  <ArrowRight />
                </IconButton>
              </div>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

export const About = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col">
        <div className="font-bold text-xl mb-5">Getting started</div>
        <div className="flex flex-col">
          <GettingStartedCard
            title={"Start you server"}
            content={
              "Start your server and copy its address.If you are starting the server on the local machine. Use ngrok to expose your server."
            }
            number={1}
            action={undefined}
          />
          <GettingStartedCard
            title={"Setup a proxy"}
            content={
              "Choose a port for the proxy. Paste the address of the server into the downstream field. Give the proxy a name. For example Backend service. Click save and than start the proxy using the green play button"
            }
            number={2}
            action={() => {
              navigate(routes.CONFIG);
            }}
          />
          <GettingStartedCard
            title={"View the traffic"}
            content={"See all the traffic of your server"}
            number={3}
            action={() => {
              navigate(routes.REQUESTS);
            }}
          />
          <GettingStartedCard
            title={"Create mocks"}
            content={"Create mocks for your application."}
            number={4}
            action={() => {
              navigate(routes.MOCKS);
            }}
          />
          <GettingStartedCard
            title={"Get your openAPI schema"}
            content={" Export your API as an openAPI schema."}
            number={5}
            action={() => {
              navigate(routes.OPENAPI);
            }}
          />
          <GettingStartedCard
            title={"Organize in collections"}
            content={
              "Organize all of your APIs in collections and share them with you teammates."
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
