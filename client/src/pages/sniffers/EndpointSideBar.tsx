import queryString from "query-string";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { routes } from "../../constants/routes";
import { useSniffersStore } from "../../stores/sniffersStores";
import { Endpoint } from "./Endpoint";
import { ImportRequestModal } from "./import-reques-modal/import-request-modal";
import { CiImport } from "react-icons/ci";

type EndpointSideBarProps = {
  showAdd?: boolean;
};
export const EndpointSideBar = ({ showAdd = true }: EndpointSideBarProps) => {
  const [showImport, setShowImport] = useState(false);
  const navigate = useNavigate();
  const { endpointId } = useParams();
  const location = useLocation();
  const { snifferId } = queryString.parse(location.search);
  const { endpoints, loadInvocations } = useSniffersStore();

  const handleImportClicked = () => {
    setShowImport(true);
  };

  const handleEndpointClicked = (endpointId: string) => {
    loadInvocations(endpointId).then(() => {
      navigate(`/endpoints/${endpointId}` + `?snifferId=${snifferId}`);
    });
  };

  return (
    <>
      {showAdd && (
        <div className="border-b border-border-color pb-2 mb-2">
          <div
            className={`flex flex-row w-full hover:bg-primary  cursor-pointer active:bg-tertiary items-center rounded-md`}
            onClick={() => {
              navigate(routes.CREATE_ENDPOINT + `?snifferId=${snifferId}`);
            }}
          >
            <div className="flex text-sm overflow-ellipsis whitespace-nowrap items-center p-2 gap-2">
              <AiOutlinePlus className="text-blue-500 text-xl h-[25px] w-[25px]" />
              <div>New Request</div>
            </div>
          </div>
          <div
            className={`flex flex-row w-full hover:bg-primary  cursor-pointer active:bg-tertiary items-center rounded-md gap-10`}
            onClick={handleImportClicked}
          >
            <div className="flex text-sm max-w-full overflow-ellipsis whitespace-nowrap items-center p-2 gap-2">
              <CiImport className="text-blue-500 text-xl h-[25px] w-[25px]" />
              Import
            </div>
          </div>
        </div>
      )}

      {showImport && (
        <ImportRequestModal
          onClose={() => {
            setShowImport(false);
          }}
          snifferId={(snifferId as string) ?? ""}
        />
      )}

      {endpoints.map((endpoint) => {
        return (
          <Endpoint
            isSelected={endpoint.id === endpointId}
            onClick={() => handleEndpointClicked(endpoint.id)}
            key={endpoint.id}
            method={endpoint.method}
            url={endpoint.url}
          />
        );
      })}
    </>
  );
};
