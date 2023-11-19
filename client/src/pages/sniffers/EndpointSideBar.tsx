import { useState } from "react";
import { TextField } from "@mui/material";
import { EndpointType } from "./types";
import { Endpoint } from "./Endpoint";
import { useNavigate, useParams } from "react-router-dom";

type EndpointSideBarProps = {
  endpoints: EndpointType[];
};
export const EndpointSideBar = ({ endpoints }: EndpointSideBarProps) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { snifferId, endpointId } = useParams();
  console.log("snifferId", snifferId);
  console.log("endpointId", endpointId);
  console.log("endpoints", endpoints);

  const filteredRequests =
    endpoints?.filter((endpoint) => {
      const filterByMethod = endpoint.method
        .toLowerCase()
        .includes(search.toLowerCase());
      const filterByUrl = endpoint.url
        .toLowerCase()
        .includes(search.toLowerCase());

      return filterByMethod || filterByUrl;
    }) || [];

  return (
    <>
      {/* <TextField
        label="Search Endpoint"
        variant="outlined"
        style={{ marginBottom: "16px", paddingRight: 0, width: "100%" }}
        size="small"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      /> */}
      {filteredRequests.map((request) => {
        return (
          <Endpoint
            isSelected={request.id === endpointId}
            onClick={() =>
              navigate(`/sniffers/${snifferId}/endpoints/${request.id}`)
            }
            key={request.id}
            method={request.method}
            url={request.url}
          />
        );
      })}
    </>
  );
};
