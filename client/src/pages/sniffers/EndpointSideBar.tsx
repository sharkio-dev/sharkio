import { useState } from "react";
import { TextField } from "@mui/material";
import { EndpointType } from "./types";
import { Endpoint } from "./Endpoint";

type EndpointSideBarProps = {
  activeEndpoint?: EndpointType;
  setActiveEndpoint: (endpointId: string) => void;
  endpoints: EndpointType[];
};
export const EndpointSideBar = ({
  activeEndpoint,
  setActiveEndpoint,
  endpoints: requests,
}: EndpointSideBarProps) => {
  const [search, setSearch] = useState("");

  const filteredRequests =
    requests?.filter((request) => {
      const filterByMethod = request.method
        .toLowerCase()
        .includes(search.toLowerCase());
      const filterByUrl = request.url
        .toLowerCase()
        .includes(search.toLowerCase());

      return filterByMethod || filterByUrl;
    }) || [];

  return (
    <>
      <TextField
        label="Search Endpoint"
        variant="outlined"
        style={{ marginBottom: "16px" }}
        size="small"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      {filteredRequests.map((request) => {
        return (
          <Endpoint
            isSelected={request.id === activeEndpoint?.id}
            onClick={() => setActiveEndpoint(request.id)}
            key={request.id}
            method={request.method}
            url={request.url}
          />
        );
      })}
    </>
  );
};
