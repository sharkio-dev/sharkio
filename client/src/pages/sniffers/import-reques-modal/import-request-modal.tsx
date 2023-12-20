import Editor from "@monaco-editor/react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  importRequestFromCurl,
  importRequestFromSwagger,
} from "../../../api/api";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { LoadingIcon } from "../LoadingIcon";
import { useSniffersStore } from "../../../stores/sniffersStores";

export const ImportRequestModal = ({
  onClose,
  snifferId,
}: {
  onClose: () => void;
  snifferId: string;
}) => {
  const [value, setValue] = useState("");
  const [type, setType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerateMocks, setIsGenerateMocks] = useState(false);
  const { show: showSnackbar, component: snackBar } = useSnackbar();
  const { loadSniffers } = useSniffersStore();

  const handleImportClicked = () => {
    setIsLoading(true);
    (type === "curl" ? importRequestFromCurl : importRequestFromSwagger)(
      snifferId,
      value,
    )
      .then(() => {
        showSnackbar("Imported successfully", "success");
      })
      .catch(() => {
        showSnackbar("Failed to import", "error");
      })
      .then(() => {
        showSnackbar("Reloading sniffers", "success");
        return loadSniffers();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal
      open={true}
      className="h-full w-full flex items-center justify-center"
      onClose={onClose}
    >
      <Paper className="h-fit w-1/2 p-5">
        {snackBar}
        <div className="mb-4 flex gap-10 items-center">
          <Typography variant="h6">Import requests from</Typography>
          <div>
            <Select
              defaultValue="swagger"
              onChange={(e: SelectChangeEvent) => setType(e.target.value)}
            >
              <MenuItem value={"swagger"}>Swagger</MenuItem>
              <MenuItem value={"curl"}>Curl</MenuItem>
            </Select>
          </div>
        </div>
        <div className="w-full border-b-[0.05px] my-4" />
        <div>
          <Editor
            width={"100%"}
            height={"300px"}
            theme="vs-dark"
            language={""}
            value={value}
            onChange={(v) => {
              setValue(v ?? "");
            }}
            options={{
              minimap: {
                enabled: false,
              },
            }}
          />
        </div>
        <div>
          <FormControlLabel
            value={isGenerateMocks}
            control={<Checkbox value={isGenerateMocks} />}
            onChange={(e, checked) => {
              setIsGenerateMocks(checked);
            }}
            label="Generate mocks?"
          />
        </div>
        <div className="flex justify-end pt-5 gap-5">
          <Button
            onClick={handleImportClicked}
            variant="contained"
            color="primary"
          >
            <div className="flex items-center gap-2">
              <div>import</div>
              {isLoading && <LoadingIcon />}
            </div>
          </Button>
          <Button onClick={onClose} color="error" variant="contained">
            Cancel
          </Button>
        </div>
      </Paper>
    </Modal>
  );
};
