import { Button, Modal, Paper, TextField } from "@mui/material";
import React from "react";
import { CopyAll } from "@mui/icons-material";
import { ConfigButton } from "../../components/config-card/ConfigButton";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useApiKeysStore } from "../../stores/apiKeysStore";

type GenerateTokenModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
export const GenerateTokenModal = ({
  isOpen,
  onClose,
}: GenerateTokenModalProps) => {
  const [name, setName] = React.useState<string>("");
  const [newToken, setNewToken] = React.useState<string>("");
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { addKey } = useApiKeysStore();

  const generateKey = () => {
    addKey(name)
      .then((res) => {
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
            <>
              <div className="text-sm mb-4">
                Please copy your new API key. We won't display it again.
              </div>
              <div className="flex flex-row w-full items-center">
                <TextField
                  label="Key"
                  variant="outlined"
                  className="mb-4"
                  disabled={true}
                  value={newToken}
                  sx={{ width: "100%" }}
                >
                  <ConfigButton
                    tooltip={"Copy to clipboard"}
                    className="ml-2"
                    onClick={onCopy}
                  >
                    <CopyAll color="success" fontSize="small" />
                  </ConfigButton>
                </TextField>
                <ConfigButton
                  tooltip={"Copy to clipboard"}
                  className="ml-2"
                  onClick={onCopy}
                >
                  <CopyAll color="success" fontSize="small" />
                </ConfigButton>
              </div>
            </>
          )}

          <div className="flex flex-row justify-end mt-4">
            {!newToken && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={generateKey}
                >
                  Generate
                </Button>
              </>
            )}
          </div>
        </Paper>
      </Modal>
    </>
  );
};
