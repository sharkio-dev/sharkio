import { Button, Modal, Paper, TextField } from "@mui/material";
import React, { useCallback, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { CopyAll, Delete, Edit } from "@mui/icons-material";
import { ConfigButton } from "../../components/config-card/ConfigButton";
import axios from "axios";
import { useSnackbar } from "../../hooks/useSnackbar";

const getKeys = () => {
  return axios.get("/sharkio/settings/api-keys");
};

const postKey = (name: string) => {
  return axios.post("/sharkio/settings/api-keys", { name });
};

const deleteKey = (id: string) => {
  return axios.delete(`/sharkio/settings/api-keys/${id}`);
};

const editKey = (id: string, name: string) => {
  return axios.put(`/sharkio/settings/api-keys/${id}`, { name });
};

type Key = {
  id: string;
  name: string;
  key: string;
};

function APIKeys() {
  const [keys, setKeys] = React.useState<Key[]>([]);
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState<boolean>(false);
  const [editKeyId, setEditKeyId] = React.useState<string>("");

  const updateKeys = () => {
    getKeys()
      .then((res) => {
        setKeys(res.data);
      })
      .catch((err) => {
        showSnackbar("Error fetching API keys", "error");
      });
  };

  useEffect(() => {
    updateKeys();
  }, []);

  const invokeKey = (id: string) => {
    deleteKey(id)
      .then(() => {
        setKeys(keys.filter((key) => key.id !== id));
        showSnackbar("API key deleted successfully", "success");
        updateKeys();
      })
      .catch(() => {
        showSnackbar("Error deleting API key", "error");
      });
  };

  const onEditKey = (id: string) => {
    setEditKeyId(id);
    setIsEditModalOpen(true);
  };

  const onCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditKeyId("");
  };

  return (
    <div className="flex flex-col w-full h-full">
      {snackBar}
      <GenerateTokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={() => updateKeys()}
      />
      <EditTokenModal
        isOpen={isEditModalOpen}
        onClose={onCloseEditModal}
        onSubmit={() => updateKeys()}
        name={keys.find((key) => key.id === editKeyId)?.name ?? ""}
        keyId={editKeyId}
      />
      <div className="flex flex-row justify-between items-center">
        <div className="text-2xl font-bold">API Keys</div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsModalOpen(true)}
        >
          Generate API Key
        </Button>
      </div>
      <div className="w-full border-b-[0.05px] my-4" />
      {keys.length > 0 && (
        <div className="text whitespace-pre-line mb-8">
          {
            "Below, you'll find your confidential API keys.\nPlease be aware that once generated, we won't display your secret API keys again."
          }
        </div>
      )}
      {/* {keys.length === 0 && (
        <div className="text-lg">
          There are no API keys associated with your account.
        </div>
      )} */}
      <TableContainer
        sx={{ width: "75%", alignSelf: "center" }}
        className="s:w-3/4"
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                style={{ fontWeight: "bold" }}
                sx={{ color: "GrayText" }}
              >
                Name
              </TableCell>
              <TableCell
                align="left"
                style={{ fontWeight: "bold" }}
                sx={{ color: "GrayText" }}
              >
                Key
              </TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {keys.map((row) => (
              <TableRow key={row.name}>
                <TableCell align="left">{row.name}</TableCell>
                <TableCell align="left">{row.key}</TableCell>
                <TableCell align="left">
                  <div className="flex flex-row-reverse w-full ">
                    <ConfigButton
                      tooltip={"Delete the API key"}
                      onClick={() => invokeKey(row.id)}
                    >
                      <Delete color="error" fontSize="small" />
                    </ConfigButton>
                    <ConfigButton
                      tooltip={"Edit the API key"}
                      onClick={() => onEditKey(row.id)}
                      className="mr-2"
                    >
                      <Edit color="info" fontSize="small" />
                    </ConfigButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

type GenerateTokenModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: () => void;
};

const GenerateTokenModal = ({
  isOpen,
  onClose,
  onGenerate,
}: GenerateTokenModalProps) => {
  const [name, setName] = React.useState<string>("");
  const [newToken, setNewToken] = React.useState<string>("");
  const { show: showSnackbar, component: snackBar } = useSnackbar();

  const generateKey = () => {
    postKey(name)
      .then((res) => {
        onGenerate();
        showSnackbar("API key generated successfully", "success");
        setName("");
        setNewToken(res.data.key);
      })
      .catch(() => {
        showSnackbar("Error generating API key", "error");
      });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(newToken);
    showSnackbar("API key copied to clipboard", "success");
  };

  const onCloseClick = () => {
    onClose();
    setNewToken("");
    setName("");
  };

  return (
    <>
      {snackBar}
      <Modal
        open={isOpen}
        onClose={onCloseClick}
        className="flex justify-center items-center"
      >
        <Paper className="flex flex-col p-4 w-96">
          <div className="text-2xl font-bold">Generate API Key</div>
          <div className="w-full border-b-[0.05px] my-4" />
          {!newToken && (
            <TextField
              label="Name"
              variant="outlined"
              className="mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {newToken && (
            <TextField
              label="Key"
              variant="outlined"
              className="mb-4"
              disabled={true}
              value={newToken}
            >
              <ConfigButton
                tooltip={"Copy to clipboard"}
                className="ml-2"
                onClick={onCopy}
              >
                <CopyAll color="success" fontSize="small" />
              </ConfigButton>
            </TextField>
          )}

          <div className="flex flex-row justify-end mt-4">
            {!newToken && (
              <Button variant="contained" color="primary" onClick={generateKey}>
                Generate
              </Button>
            )}
            {newToken && (
              <ConfigButton
                tooltip={"Copy to clipboard"}
                className="ml-2"
                onClick={onCopy}
              >
                <CopyAll color="success" fontSize="small" />
              </ConfigButton>
            )}
          </div>
        </Paper>
      </Modal>
    </>
  );
};

type EditTokenModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  name: string;
  keyId: string;
};

const EditTokenModal = ({
  isOpen,
  onClose,
  onSubmit,
  name,
  keyId,
}: EditTokenModalProps) => {
  const [newName, setNewName] = React.useState<string>(name);
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  console.log(newName);

  const submit = useCallback(() => {
    editKey(keyId, newName)
      .then((res) => {
        onSubmit();
        showSnackbar("API key edited successfully", "success");
        setNewName("");
      })
      .catch(() => {
        showSnackbar("Error editing API key", "error");
      });
  }, [keyId, name, onSubmit, showSnackbar]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  return (
    <>
      {snackBar}
      <Modal
        open={isOpen}
        onClose={onClose}
        className="flex justify-center items-center"
      >
        <Paper className="flex flex-col p-4 w-96">
          <div className="text-2xl font-bold">Edit API Key Name</div>
          <div className="w-full border-b-[0.05px] my-4" />
          <TextField
            label="Name"
            variant="outlined"
            className="mb-4"
            value={newName}
            onChange={onChange}
          />
          <div className="flex flex-row justify-end mt-4">
            <Button variant="contained" color="primary" onClick={submit}>
              Submit
            </Button>
          </div>
        </Paper>
      </Modal>
    </>
  );
};

export default APIKeys;
