import { useState } from "react";
import { GiSharkFin } from "react-icons/gi";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { DeleteSnifferModal } from "./DeleteSnifferModal";
import { EditSnifferModal } from "./EditSnifferModal";
import { AddSnifferModal } from "./AddSnifferModal";
import { Sniffer, useSniffersStore } from "../../stores/sniffersStores";

type SniffersSideBarProps = {
  activeSniffer?: Sniffer;
  setActiveSniffer: (sniffer: Sniffer) => void;
};
export const SniffersSideBar = ({
  activeSniffer,
  setActiveSniffer,
}: SniffersSideBarProps) => {
  const [selectedSniffer, setSelectedSniffer] = useState<Sniffer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const { sniffers } = useSniffersStore();

  const onAddSnifferModalClose = () => {
    setIsAddModalOpen(false);
  };

  const onEditSnifferModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedSniffer(null);
  };

  const onEditSniffer = (sniffer: Sniffer) => {
    setSelectedSniffer(sniffer);
    setIsEditModalOpen(true);
  };

  const onDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedSniffer(null);
  };

  const onDeleteSniffer = (sniffer: Sniffer) => {
    setSelectedSniffer(sniffer);
    setIsDeleteModalOpen(true);
  };
  console.log(activeSniffer);
  console.log(sniffers);

  return (
    <>
      <div className="flex h-16 items-center p-2 mb-2 justify-between">
        <div className="text-white text-xl font-bold">Sniffers</div>
        <AiOutlinePlus
          className="text-blue-200 text-xl hover:cursor-pointer active:scale-110"
          onClick={() => setIsAddModalOpen(true)}
        />
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

      {sniffers.map((sniffer, i) => (
        <div
          key={i}
          className={`group flex h-10 items-center px-2 shadow-lg border-b-[0.1px] border-border-color cursor-pointer hover:bg-tertiary transition-colors active:first:bg-tertiary ${
            activeSniffer?.id === sniffer.id && "bg-tertiary"
          }`}
        >
          <div
            className="flex items-center w-full active:scale-105 h-full"
            onClick={() => setActiveSniffer(sniffer)}
          >
            <GiSharkFin className="text-blue-200 mr-2" />
            <div className="text-white text-sm">{sniffer.name}</div>
          </div>
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100">
            <AiOutlineEdit
              className="opacity-0 group-hover:opacity-100 text-amber-200 active:scale-110 text-lg"
              onClick={() => onEditSniffer(sniffer)}
            />
            <AiOutlineDelete
              className="opacity-0 group-hover:opacity-100 text-red-200 active:scale-110 text-lg"
              onClick={() => onDeleteSniffer(sniffer)}
            />
          </div>
        </div>
      ))}
    </>
  );
};
