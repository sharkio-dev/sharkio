import { useEffect, useState } from "react";
import { GiSharkFin } from "react-icons/gi";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { SnifferType, useSniffersStore } from "../../stores/sniffersStores";
import { useNavigate, useParams } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { EndpointSideBar } from "./EndpointSideBar";
import { useSnackbar } from "../../hooks/useSnackbar";
import { LoadingIcon } from "./LoadingIcon";
import { AddSnifferModal } from "./AddSnifferModal";
import { EditSnifferModal } from "./EditSnifferModal";
import { DeleteSnifferModal } from "./DeleteSnifferModal";

export const SniffersSideBar = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const { sniffers } = useSniffersStore();
  const navigator = useNavigate();
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { snifferId } = useParams();
  const {
    loadEndpoints,
    resetEndpoints,
    loadingEndpoints,
    selectedSniffer,
    setSelectedSniffer,
  } = useSniffersStore();

  useEffect(() => {
    if (!snifferId) {
      resetEndpoints();
      return;
    }
    loadEndpoints(snifferId).catch(() => {
      showSnackbar("Failed to get endpoints", "error");
    });
  }, [snifferId, sniffers]);

  useEffect(() => {
    if (selectedSniffer && !snifferId) {
      navigator(`/sniffers/${selectedSniffer.id}`);
    } else if (sniffers.length > 0 && !selectedSniffer && !snifferId) {
      navigator(`/sniffers/${sniffers[0].id}`);
      return;
    }
  }, [selectedSniffer, sniffers]);

  const onAddSnifferModalClose = () => {
    setIsAddModalOpen(false);
  };

  const onEditSnifferModalClose = () => {
    setIsEditModalOpen(false);
  };

  const onEditSniffer = (sniffer: SnifferType) => {
    setIsEditModalOpen(true);
  };

  const onDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedSniffer(null);
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
          <Select value={snifferId || ""} label="Sniffers">
            <MenuItem
              onClick={() => setIsAddModalOpen(true)}
              value={"addSniffer"}
            >
              <SideBarItem
                LeftIcon={AiOutlinePlus}
                isSelected={false}
                onClick={() => setIsAddModalOpen(true)}
                name={"Add Sniffer"}
              />
            </MenuItem>
            {sniffers.map((sniffer, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  navigator(`/sniffers/${sniffer.id}`);
                }}
                value={sniffer.id}
              >
                <SideBarItem
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

export const SideBarItem = ({
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
