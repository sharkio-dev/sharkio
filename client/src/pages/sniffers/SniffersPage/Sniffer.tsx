import React from "react";
import { useSniffersStore } from "../../../stores/sniffersStores";
import { AiOutlineBank, AiOutlineDatabase } from "react-icons/ai";
import List from "@mui/material/List";
import UrlItem from "../UrlItem";
import { useLocation, useParams } from "react-router-dom";
import queryString from "query-string";

const Sniffer: React.FC = () => {
  const location = useLocation();
  const { snifferId } = queryString.parse(location.search);
  const sniffer = useSniffersStore((s) =>
    s.sniffers.find((s) => s.id === snifferId)
  );
  const { loadingSniffers } = useSniffersStore();
  if (!sniffer)
    return (
      <div className="flex flex-1 items-center justify-center flex-col">
        {!loadingSniffers && (
          <>
            <div className="text-2xl font-bold">Create a Sniffer</div>
            <div className="text-lg font-medium ">
              Create a new sniffer to start recording requests
            </div>
          </>
        )}
      </div>
    );

  const FullSnifferUrl = `https://${sniffer.subdomain}.${
    import.meta.env.VITE_PROXY_DOMAIN
  }`;
  return (
    <div className="flex flex-col w-full items-center space-y-4 justify-center ">
      <List
        className="items-center flex flex-col space-y-2 bg-primary "
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
          SnifferURL={sniffer.downstreamUrl}
          Icon={AiOutlineBank}
          Label="Server's Domain"
          Title="Copy Server Domain to clipboard"
        />
      </List>
    </div>
  );
};

export default Sniffer;
