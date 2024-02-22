import { useEffect } from "react";
import { GiSharkFin } from "react-icons/gi";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineEdit } from "react-icons/ai";
import { useSniffersStore } from "../../stores/sniffersStores";
import { useLocation, useSearchParams } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { EndpointSideBar } from "./EndpointSideBar";
import { useSnackbar } from "../../hooks/useSnackbar";
import { LoadingIcon } from "./LoadingIcon";
import queryString from "query-string";

export const SniffersSideBar: React.FC = () => {
  const { sniffers } = useSniffersStore();
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadEndpoints, loadingEndpoints } = useSniffersStore();
  const [_, setSearchParams] = useSearchParams();

  const location = useLocation();

  const { snifferId } = queryString.parse(location.search);
  useEffect(() => {
    if (!snifferId) {
      if (sniffers.length > 0) {
        setSearchParams((params) => {
          const newParams = new URLSearchParams(params);
          newParams.set("snifferId", sniffers[0].id);
          return newParams;
        });
      }
      return;
    }
    loadEndpoints(snifferId as string).catch(() => {
      showSnackbar("Failed to get endpoints", "error");
    });
  }, [snifferId]);

  return (
    <>
      <div className="flex flex-col justify-between items-center px-2 pt-4 space-y-4 overflow-y-auto">
        {snackBar}
        <ProxySelector
          onSnifferSelected={(snifferId) => {
            setSearchParams((params) => {
              const newParams = new URLSearchParams(params);
              newParams.set("snifferId", snifferId);
              return newParams;
            });
          }}
          snifferId={(snifferId as string) || ""}
        />
        {snifferId && (
          <div className="flex flex-col w-full overflow-y-auto">
            {loadingEndpoints ? (
              <div className="flex justify-center items-center">
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

export const ProxySelector = ({
  onSnifferSelected,
  snifferId,
  isDisabled,
}: {
  onSnifferSelected?: (snifferId: string) => void;
  snifferId?: string;
  isDisabled?: boolean;
}) => {
  const { sniffers } = useSniffersStore();

  return (
    <FormControl fullWidth size="small" variant="outlined">
      <InputLabel>Proxies</InputLabel>
      <Select value={snifferId || ""} label="Proxies">
        {sniffers.map((sniffer, i) => (
          <MenuItem
            key={i}
            onClick={() => {
              if (isDisabled) return;
              onSnifferSelected && onSnifferSelected(sniffer.id);
            }}
            value={sniffer.id}
            disabled={isDisabled}
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
  );
};

type SnifferProps = {
  isSelected?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  name: string;
  LeftIcon?: any;
};

export const SideBarItem = ({
  isSelected = false,
  onClick,
  onEdit,
  onDelete,
  name,
  LeftIcon,
}: SnifferProps) => {
  const editSniffer = (event: any) => {
    onEdit && onEdit();
    event.stopPropagation();
  };

  const deleteSniffer = (event: any) => {
    onDelete && onDelete();
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
        {onEdit && (
          <AiOutlineEdit
            className="opacity-0 group-hover:opacity-100 text-amber-400 active:scale-110 text-lg"
            onClick={editSniffer}
          />
        )}
        {onDelete && (
          <AiOutlineDelete
            className="opacity-0 group-hover:opacity-100 text-red-400 active:scale-110 text-lg"
            onClick={deleteSniffer}
          />
        )}
      </div>
    </div>
  );
};
