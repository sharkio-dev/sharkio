import React, {
  PropsWithChildren,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuthStore } from "../../stores/authStore";
import { Navbar } from "../navbar/navbar";
import { SideBar } from "../sidebar/sidebar";
import { GiSharkFin } from "react-icons/gi";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { Modal, Paper, TextField, Button } from "@mui/material";
import { useSnackbar } from "../../hooks/useSnackbar";
import {
  createSniffer,
  deleteSniffer,
  editSniffer,
  getSniffers,
} from "../../api/api";
import { CircularProgress } from "@mui/material";

type Sniffer = {
  name: string;
  id: string;
  downstreamUrl: string;
  port: number;
};

export const PageTemplate: React.FC<PropsWithChildren> = ({ children }) => {
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user != null && user.email != null) {
      setSideMenuOpen(true);
    } else {
      setSideMenuOpen(false);
    }
  }, [user]);

  return (
    <div className="flex flex-row h-full w-full min-h-screen">
      {/* {sideMenuOpen && <SideBar />} */}
      <div className="flex flex-col flex-1 bg-[#1d1d1d]">
        <Navbar />
        <div className="flex h-full w-full">
          <SniffersSideBar />
          <div className="flex bg-[#232323] h-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

const SniffersSideBar = () => {
  const [active, setActive] = useState<number>(0);
  const [sniffers, setSniffers] = useState<Sniffer[]>([]);
  const [selectedSniffer, setSelectedSniffer] = useState<Sniffer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const { user } = useAuthStore();
  const userId = user?.id;
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const loadData = async () => {
    if (userId == null) {
      return;
    }
    return getSniffers()
      .then((res: any) => {
        setSniffers(res.data);
      })
      .catch(() => {
        showSnackbar("Failed to get sniffers", "error");
      });
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const onAddSnifferModalClose = () => {
    setIsAddModalOpen(false);
    loadData();
  };

  const onEditSnifferModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedSniffer(null);
    loadData();
  };

  const onEditSniffer = (sniffer: Sniffer) => {
    setSelectedSniffer(sniffer);
    setIsEditModalOpen(true);
  };

  const onDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedSniffer(null);
    loadData();
  };

  const onDeleteSniffer = (sniffer: Sniffer) => {
    setSelectedSniffer(sniffer);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="relative min-w-[240px] border-r-[0.1px] border-[#3a3a3a]">
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
          className={`group flex h-10 items-center px-2 shadow-lg border-b-[0.1px] border-[#3a3a3a] cursor-pointer hover:bg-[#232323] transition-colors active:first:bg-[#232323] ${
            active === i && "bg-[#232323]"
          }`}
        >
          <div
            className="flex items-center w-full active:scale-105 h-full"
            onClick={() => setActive(i)}
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
    </div>
  );
};

type AddSnifferModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AddSnifferModal = ({ isOpen, onClose }: AddSnifferModalProps) => {
  const [name, setName] = useState<string>("");
  const [downstreamUrl, setDownstreamUrl] = useState<string>("");
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddSniffer = () => {
    if (name === "") {
      showSnackbar("Name cannot be empty", "error");
      return;
    }
    if (downstreamUrl === "") {
      showSnackbar("Downstream Url cannot be empty", "error");
      return;
    }
    setIsLoading(true);
    // TODO: port should not be required
    createSniffer({ name, downstreamUrl, port: 0 })
      .then(() => {
        setName("");
        setDownstreamUrl("");
        onClose();
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error creating sniffer", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {snackBar}
      <Modal
        open={isOpen}
        onClose={onClose}
        className="flex justify-center items-center"
      >
        <Paper className="flex flex-col p-4 w-96 rounded-sm">
          <div className="text-2xl font-bold">Add Sniffer</div>
          <div className="w-full border-b-[0.05px] my-4" />
          <div className="flex flex-col space-y-2">
            <TextField
              label={"Name"}
              placeholder="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <TextField
              label={"Downstream Url"}
              placeholder="http://example.com"
              value={downstreamUrl}
              onChange={(event) => setDownstreamUrl(event.target.value)}
            />
          </div>

          <div className="flex flex-row justify-end mt-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSniffer}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Add"}
            </Button>
          </div>
        </Paper>
      </Modal>
    </>
  );
};

type EdirSnifferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sniffer: Sniffer;
};

const EditSnifferModal = ({
  isOpen,
  onClose,
  sniffer,
}: EdirSnifferModalProps) => {
  const [name, setName] = useState<string>(sniffer.name);
  const [downstreamUrl, setDownstreamUrl] = useState<string>(
    sniffer.downstreamUrl,
  );
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEditSniffer = useCallback(() => {
    if (name === "") {
      showSnackbar("Name cannot be empty", "error");
      return;
    }
    if (downstreamUrl === "") {
      showSnackbar("Downstream Url cannot be empty", "error");
      return;
    }
    setIsLoading(true);
    editSniffer({ name, downstreamUrl, port: sniffer.port, id: sniffer.id })
      .then(() => {
        setName("");
        setDownstreamUrl("");
        onClose();
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error creating sniffer", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [name, downstreamUrl, sniffer, showSnackbar, onClose]);

  return (
    <>
      {snackBar}
      <Modal
        open={isOpen}
        onClose={onClose}
        className="flex justify-center items-center"
      >
        <Paper className="flex flex-col p-4 w-96 rounded-sm">
          <div className="text-2xl font-bold">Edit Sniffer</div>
          <div className="w-full border-b-[0.05px] my-4" />
          <div className="flex flex-col space-y-2">
            <TextField
              label={"Name"}
              placeholder="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <TextField
              label={"Downstream Url"}
              placeholder="http://example.com"
              value={downstreamUrl}
              onChange={(event) => setDownstreamUrl(event.target.value)}
            />
          </div>

          <div className="flex flex-row justify-end mt-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditSniffer}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </div>
        </Paper>
      </Modal>
    </>
  );
};

type DeleteSnifferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sniffer: Sniffer;
};

const DeleteSnifferModal = ({
  isOpen,
  onClose,
  sniffer,
}: DeleteSnifferModalProps) => {
  const [verifyDelete, setVerifyDelete] = useState("");
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDeleteSniffer = useCallback(() => {
    // TODO: port should not be required
    if (sniffer.name !== verifyDelete) {
      showSnackbar("Please type the name of the sniffer to delete", "error");
      return;
    }
    setIsLoading(true);
    deleteSniffer(sniffer.id)
      .then(() => {
        onClose();
      })
      .catch(() => {
        showSnackbar("Error deleting sniffer", "error");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [showSnackbar, onClose, verifyDelete, sniffer]);

  return (
    <>
      {snackBar}
      <Modal
        open={isOpen}
        onClose={onClose}
        className="flex justify-center items-center"
      >
        <Paper className="flex flex-col p-4 w-96 rounded-sm">
          <div className="text-2xl font-bold">Edit Sniffer</div>
          <div className="w-full border-b-[0.05px] my-4" />
          <div className="flex flex-col space-y-2">
            <TextField
              label={"Delete"}
              placeholder={`Type "${sniffer.name}" to delete`}
              value={verifyDelete}
              onChange={(event) => setVerifyDelete(event.target.value)}
            />
          </div>

          <div className="flex flex-row justify-end mt-4">
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteSniffer}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Delete"}
            </Button>
          </div>
        </Paper>
      </Modal>
    </>
  );
};
