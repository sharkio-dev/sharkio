import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EndpointType } from "./types";
import { AiOutlinePlus } from "react-icons/ai";
import { Endpoint } from "./endpoint";

type EndpointSideBarProps = {
  endpoints: EndpointType[];
  showAdd?: boolean;
};
export const EndpointSideBar = ({
  endpoints,
  showAdd = true,
}: EndpointSideBarProps) => {
  const [search, _] = useState("");
  const navigate = useNavigate();
  const { snifferId, endpointId } = useParams();

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
      {showAdd && (
        <div
          className={`flex flex-row w-full hover:bg-primary  cursor-pointer active:bg-tertiary items-center rounded-md p-2`}
          onClick={() => navigate(`/sniffers/${snifferId}/invocations/create`)}
        >
          <div className="flex text-sm max-w-full overflow-ellipsis whitespace-nowrap items-center">
            <AiOutlinePlus className="text-blue-500 h-8 w-8 p-1 mr-4" />
            New
          </div>
        </div>
      )}

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
