import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { EndpointType } from "./types";
import { Endpoint } from "./Endpoint";
import { Sniffer } from "../../stores/sniffersStores";
import { useSnackbar } from "../../hooks/useSnackbar";
import { LoadingIcon } from "./LoadingIcon";
import { getEnpoints } from "../../api/api";

type EndpointSideBarProps = {
  activeEndpoint?: EndpointType;
  setActiveEndpoint: (endpointId: EndpointType) => void;
  activeSniffer: Sniffer;
};
export const EndpointSideBar = ({
  activeEndpoint,
  setActiveEndpoint,
  activeSniffer,
}: EndpointSideBarProps) => {
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<EndpointType[]>();
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [loadingEndpoints, setLoadingEndpoints] = useState(false);

  useEffect(() => {
    if (!activeSniffer) return;
    setLoadingEndpoints(true);
    getEnpoints(activeSniffer.id)
      .then((res) => {
        console.log({ invocations: res.data });
        setRequests(res.data);
      })
      .catch((err) => {
        showSnackbar("Failed to get endpoints", "error");
      })
      .finally(() => {
        setLoadingEndpoints(false);
      });
  }, [activeSniffer]);

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
      {snackBar}
      <TextField
        label="Search Endpoint"
        variant="outlined"
        style={{ marginBottom: "16px" }}
        size="small"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      {loadingEndpoints ? (
        <div className="flex flex-1 justify-center items-center">
          <LoadingIcon />
        </div>
      ) : (
        filteredRequests.map((request) => {
          return (
            <Endpoint
              isSelected={request.id === activeEndpoint?.id}
              onClick={() => setActiveEndpoint(request)}
              key={request.id}
              method={request.method}
              url={request.url}
            />
          );
        })
      )}
    </>
  );
};
