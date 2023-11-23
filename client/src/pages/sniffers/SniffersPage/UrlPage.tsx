import React from "react";
import { SnifferType } from "../../../stores/sniffersStores";
import { AiOutlineBank, AiOutlineDatabase } from "react-icons/ai";
import List from "@mui/material/List";
import UrlItem from "../UrlItem";

interface UrlPageProps {
  SnifferDetails: SnifferType;
}
const UrlPage: React.FC<UrlPageProps> = ({ SnifferDetails }) => {

  const FullSnifferUrl = `https://${SnifferDetails.subdomain}.sniffer.sharkio.dev`;
  return (
    <div className="flex flex-col w-full items-center space-y-4 justify-center ">
      <List
        className="items-center flex flex-col space-y-4  bg-primary "
        sx={{
          width: "100%",
          maxWidth: "50%",
          borderRadius: "20px",
        }}
      >
        <UrlItem
          SnifferURL={FullSnifferUrl}
          Icon={AiOutlineDatabase}
          Label="Sniffer's Domain"
          Title="Copy Sniffer Domain to clipboard"
        />
        <UrlItem
          SnifferURL={SnifferDetails.downstreamUrl}
          Icon={AiOutlineBank}
          Label="Server's Domain"
          Title="Copy Server Domain to clipboard"
        />
      </List>
    </div>
  );
};

export default UrlPage;

//full domain - https // domain // proxy
//when click add effect
