import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { useSnackbar } from "../../hooks/useSnackbar";
import { deleteKey, getKeys } from "../../api/apiKeys";
import { EditTokenModal } from "./EditTokenModal";
import { GenerateTokenModal } from "./GenerateTokenModal";
import { KeysTable } from "./KeysTable";

export type Key = {
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
        setKeys(res.data || []);
      })
      .catch((err) => {
        console.log(err);
        showSnackbar("Error fetching API keys", "error");
      });
  };

  useEffect(() => {
    updateKeys();
  }, []);

  const invokeKey = (id: string) => {
    deleteKey(id)
      .then(() => {
        showSnackbar("API key deleted successfully", "success");
        updateKeys();
      })
      .catch((err) => {
        console.log(err);
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
      {keys.length === 0 && (
        <div className="text-lg">
          There are no API keys associated with your account.
        </div>
      )}
      {keys.length > 0 && (
        <KeysTable keys={keys} invokeKey={invokeKey} onEditKey={onEditKey} />
      )}
    </div>
  );
}

export default APIKeys;