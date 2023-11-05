import { useContext, useEffect } from "react";
import { RequestsMetadataContext } from "../../context/requests-context";
import { TextField } from "@mui/material";
import { EndpointType } from "./types";
import { Endpoint } from "./Endpoint";

type EndpointSideBarProps = {
  activeEndpoint?: EndpointType;
  setActiveEndpoint: (endpointId: EndpointType) => void;
};
export const EndpointSideBar = ({
  activeEndpoint,
  setActiveEndpoint,
}: EndpointSideBarProps) => {
  const {
    requestsData: requests,
    servicesData: services,
    loadData,
    loading,
  } = useContext(RequestsMetadataContext);

  useEffect(() => {
    loadData?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const manyRequests = requests
    ? [
        ...requests,
        { id: "1", method: "DELETE", url: "https://google.com" },
        { id: "2", method: "PUT", url: "https://google.com" },
        { id: "3", method: "POST", url: "https://google.com" },
        { id: "4", method: "PATCH", url: "https://google.com" },
        { id: "5", method: "OPTIONS", url: "https://google.com" },
      ]
    : [];

  return (
    <>
      <TextField
        label="Search Endpoint"
        variant="outlined"
        style={{ marginBottom: "16px" }}
        size="small"
      />
      {requests &&
        services &&
        manyRequests?.map((request) => {
          return (
            <Endpoint
              isSelected={request.id === activeEndpoint?.id}
              onClick={() => setActiveEndpoint(request)}
              key={request.id}
              method={request.method}
              url={request.url}
            />
          );
        })}
    </>
  );
};
