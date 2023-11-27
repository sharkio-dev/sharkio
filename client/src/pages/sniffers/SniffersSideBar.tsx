import { useEffect, useState } from "react";
import { GiSharkFin } from "react-icons/gi";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { SnifferType, useSniffersStore } from "../../stores/sniffersStores";
import { useNavigate, useParams } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { MdOutlineEmergencyRecording } from "react-icons/md";
import { EndpointType } from "./types";
import { EndpointSideBar } from "./EndpointSideBar";
import { getEnpoints } from "../../api/api";
import { useSnackbar } from "../../hooks/useSnackbar";
import { LoadingIcon } from "./LoadingIcon";
import { AddSnifferModal } from "./AddSnifferModal";
import { EditSnifferModal } from "./EditSnifferModal";
import { DeleteSnifferModal } from "./DeleteSnifferModal";

export const SniffersSideBar = () => {
  const [selectedSniffer, setSelectedSniffer] = useState<SnifferType | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const { sniffers } = useSniffersStore();
  const [selectValue, setSelectValue] = useState<string>("");
  const navigator = useNavigate();
  const [endpoints, setEndpoints] = useState<EndpointType[]>([]);
  const [loadingEndpoints, setLoadingEndpoints] = useState<boolean>(false);
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { snifferId } = useParams();

  // Populate the endpoints of the screen
  useEffect(() => {
    if (!snifferId) {
      setEndpoints([]);
      setSelectValue("live");
      return;
    }
    setSelectValue(snifferId);
    setLoadingEndpoints(true);
    getEnpoints(snifferId)
      .then((res) => {
        setEndpoints(res || []);
      })
      .catch(() => {
        showSnackbar("Failed to get endpoints", "error");
      })
      .finally(() => {
        setLoadingEndpoints(false);
      });
  }, [snifferId]);

  const onAddSnifferModalClose = () => {
    setIsAddModalOpen(false);
  };

  const onEditSnifferModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedSniffer(null);
  };

  const onEditSniffer = (sniffer: SnifferType) => {
    setSelectedSniffer(sniffer);
    setIsEditModalOpen(true);
  };

  const onDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedSniffer(null);
    navigator("/live");
  };

  const onDeleteSniffer = (sniffer: SnifferType) => {
    setSelectedSniffer(sniffer);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col justify-between items-center px-2 pt-4 space-y-4 h-[calc(vh-96px)] max-h-[calc(vh-96px)] overflow-y-auto">
        {snackBar}
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel>Sniffers</InputLabel>
          <Select value={selectValue} label="Sniffers">
            <MenuItem
              onClick={() => setIsAddModalOpen(true)}
              value={"addSniffer"}
            >
              <Sniffer
                LeftIcon={AiOutlinePlus}
                isSelected={false}
                onClick={() => setIsAddModalOpen(true)}
                name={"Add Sniffer"}
              />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setEndpoints([]);
                navigator("/live");
                setSelectValue("live");
              }}
              value={"live"}
            >
              <Sniffer
                LeftIcon={MdOutlineEmergencyRecording}
                isSelected={false}
                name={"Live Invocations"}
              />
            </MenuItem>
            {sniffers.map((sniffer, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  setSelectValue(sniffer.id);
                  navigator(`/sniffers/${sniffer.id}`);
                }}
                value={sniffer.id}
              >
                <Sniffer
                  LeftIcon={GiSharkFin}
                  isSelected={snifferId === sniffer.id}
                  onEditSniffer={() => onEditSniffer(sniffer)}
                  onDeleteSniffer={() => onDeleteSniffer(sniffer)}
                  name={sniffer.name}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="flex flex-col w-full overflow-y-auto">
          {loadingEndpoints ? (
            <div className="flex h-full justify-center items-center">
              <LoadingIcon />
            </div>
          ) : (
            <EndpointSideBar
              endpoints={endpoints}
              showAdd={selectValue !== "live"}
            />
          )}
        </div>
      </div>

      <AddSnifferModal
        isOpen={isAddModalOpen}
        onClose={onAddSnifferModalClose}
      />
      {selectedSniffer && (
        <EditSnifferModal
          isOpen={isEditModalOpen}
          onClose={onEditSnifferModalClose}
          sniffer={selectedSniffer}
        />
      )}
      {selectedSniffer && (
        <DeleteSnifferModal
          isOpen={isDeleteModalOpen}
          onClose={onDeleteModalClose}
          sniffer={selectedSniffer}
        />
      )}
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

export const Sniffer = ({
  isSelected = false,
  onClick,
  onEditSniffer,
  onDeleteSniffer,
  name,
  LeftIcon,
}: SnifferProps) => {
  const editSniffer = (event: any) => {
    event.stopPropagation();
    onEditSniffer && onEditSniffer();
  };

  const deleteSniffer = (event: any) => {
    event.stopPropagation();
    onDeleteSniffer && onDeleteSniffer();
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
