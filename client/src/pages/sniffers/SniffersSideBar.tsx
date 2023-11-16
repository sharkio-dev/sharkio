import { useState } from "react";
import { GiSharkFin } from "react-icons/gi";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { DeleteSnifferModal } from "./DeleteSnifferModal";
import { EditSnifferModal } from "./EditSnifferModal";
import { AddSnifferModal } from "./AddSnifferModal";
import {
  Sniffer as SnifferRow,
  useSniffersStore,
} from "../../stores/sniffersStores";
import { useNavigate } from "react-router-dom";

type SniffersSideBarProps = {
  activeSniffer?: SnifferRow;
  setActiveSniffer: (sniffer: SnifferRow) => void;
};
export const SniffersSideBar = ({
  activeSniffer,
  setActiveSniffer,
}: SniffersSideBarProps) => {
  const [selectedSniffer, setSelectedSniffer] = useState<SnifferRow | null>(
    null,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const { sniffers } = useSniffersStore();
  const navigator = useNavigate();

  const onAddSnifferModalClose = () => {
    setIsAddModalOpen(false);
  };

  const onEditSnifferModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedSniffer(null);
  };

  const onEditSniffer = (sniffer: SnifferRow) => {
    setSelectedSniffer(sniffer);
    setIsEditModalOpen(true);
  };

  const onDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedSniffer(null);
    navigator("/live");
  };

  const onDeleteSniffer = (sniffer: SnifferRow) => {
    setSelectedSniffer(sniffer);
    setIsDeleteModalOpen(true);
  };

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
        <SnifferSideBarRow
          key={i}
          isSelected={activeSniffer?.id === sniffer.id}
          onClick={() => setActiveSniffer(sniffer)}
          onEditSniffer={() => onEditSniffer(sniffer)}
          onDeleteSniffer={() => onDeleteSniffer(sniffer)}
          name={sniffer.name}
        />
      ))}
    </>
  );
};

type SnifferProps = {
  isSelected: boolean;
  onClick: () => void;
  onEditSniffer: () => void;
  onDeleteSniffer: () => void;
  name: string;
};

const SnifferSideBarRow = ({
  isSelected,
  onClick,
  onEditSniffer,
  onDeleteSniffer,
  name,
}: SnifferProps) => {
  return (
    <div
      className={`group flex h-10 items-center px-2 shadow-lg border-b-[0.1px] border-border-color cursor-pointer hover:bg-tertiary transition-colors active:first:bg-tertiary ${
        isSelected && "bg-tertiary"
      }`}
    >
      <div
        className={`flex items-center w-full active:scale-105 h-full ${
          isSelected ? "text-blue-200" : "text-white"
        }`}
        onClick={onClick}
      >
        <GiSharkFin className={`mr-2`} />
        <div className="text-sm">{name}</div>
      </div>
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100">
        <AiOutlineEdit
          className="opacity-0 group-hover:opacity-100 text-amber-200 active:scale-110 text-lg"
          onClick={onEditSniffer}
        />
        <AiOutlineDelete
          className="opacity-0 group-hover:opacity-100 text-red-200 active:scale-110 text-lg"
          onClick={onDeleteSniffer}
        />
      </div>
    </div>
  );
};
