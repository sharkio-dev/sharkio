import { useEffect } from "react";
import { GiSharkFin } from "react-icons/gi";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineEdit } from "react-icons/ai";
import { useSniffersStore } from "../../stores/sniffersStores";
import { useLocation, useNavigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { EndpointSideBar } from "./EndpointSideBar";
import { useSnackbar } from "../../hooks/useSnackbar";
import { LoadingIcon } from "./LoadingIcon";
import queryString from "query-string";
import { routes } from "../../constants/routes";

export const SniffersSideBar = () => {
  const { sniffers } = useSniffersStore();
  const navigator = useNavigate();
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadEndpoints, resetEndpoints, loadingEndpoints } =
    useSniffersStore();
  const location = useLocation();

  const { snifferId } = queryString.parse(location.search);
  useEffect(() => {
    if (!snifferId) {
      if (sniffers.length > 0) {
        let params = new URLSearchParams();
        params.append("snifferId", sniffers[0].id);
        let queryString = params.toString();
        navigator(routes.ENDPOINTS + "?" + queryString);
      }
      resetEndpoints();
      return;
    }
    loadEndpoints(snifferId as string).catch(() => {
      showSnackbar("Failed to get endpoints", "error");
    });
  }, [snifferId, sniffers]);

  return (
    <>
      <div className="flex flex-col justify-between items-center px-2 pt-4 space-y-4 h-[calc(vh-96px)] max-h-[calc(vh-96px)] overflow-y-auto">
        {snackBar}
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel>Sniffers</InputLabel>
          <Select value={snifferId || ""} label="Sniffers">
            {sniffers.map((sniffer, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  navigator(routes.ENDPOINTS + "?snifferId=" + sniffer.id);
                }}
                value={sniffer.id}
              >
                <SideBarItem
                  LeftIcon={GiSharkFin}
                  isSelected={snifferId === sniffer.id}
                  name={sniffer.name}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {snifferId && (
          <div className="flex flex-col w-full overflow-y-auto">
            {loadingEndpoints ? (
              <div className="flex h-[calc(100vh)] justify-center items-center">
                <LoadingIcon />
              </div>
            ) : (
              <EndpointSideBar />
            )}
          </div>
        )}
      </div>
    </>
  );
};

type SnifferProps = {
  isSelected?: boolean;
  onClick?: () => void;
  onEditSniffer?: () => void;
  onDeleteSniffer?: () => void;
  name: string;
  LeftIcon?: any;
};

export const SideBarItem = ({
  isSelected = false,
  onClick,
  onEditSniffer,
  onDeleteSniffer,
  name,
  LeftIcon,
}: SnifferProps) => {
  const editSniffer = (event: any) => {
    onEditSniffer && onEditSniffer();
    event.stopPropagation();
  };

  const deleteSniffer = (event: any) => {
    onDeleteSniffer && onDeleteSniffer();
    event.stopPropagation();
  };

  return (
    <div className={`group flex items-center flex-row justify-between w-full`}>
      <div
        className={`flex items-center w-full active:scale-105 h-full ${
          isSelected ? "text-blue-200" : "text-white"
        }`}
        onClick={onClick}
      >
        {LeftIcon && <LeftIcon className={`mr-2`} />}
        <div className="text-sm">{name}</div>
      </div>
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100">
        {onEditSniffer && (
          <AiOutlineEdit
            className="opacity-0 group-hover:opacity-100 text-amber-400 active:scale-110 text-lg"
            onClick={editSniffer}
          />
        )}
        {onDeleteSniffer && (
          <AiOutlineDelete
            className="opacity-0 group-hover:opacity-100 text-red-400 active:scale-110 text-lg"
            onClick={deleteSniffer}
          />
        )}
      </div>
    </div>
  );
};
