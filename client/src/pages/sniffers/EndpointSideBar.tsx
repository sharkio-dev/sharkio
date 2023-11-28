import { useNavigate, useParams } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { Endpoint } from "./Endpoint";
import { useSniffersStore } from "../../stores/sniffersStores";

type EndpointSideBarProps = {
  showAdd?: boolean;
};
export const EndpointSideBar = ({ showAdd = true }: EndpointSideBarProps) => {
  const navigate = useNavigate();
  const { snifferId, endpointId } = useParams();
  const { endpoints } = useSniffersStore();

  return (
    <>
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

      {endpoints.map((request) => {
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
