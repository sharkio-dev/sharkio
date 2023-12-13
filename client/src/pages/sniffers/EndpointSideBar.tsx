import Editor from "@monaco-editor/react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Button, Modal, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { importRequestFromCurl } from "../../api/api";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useSniffersStore } from "../../stores/sniffersStores";
import { Endpoint } from "./Endpoint";
import queryString from "query-string";
import { routes } from "../../constants/routes";

type EndpointSideBarProps = {
  showAdd?: boolean;
};
export const EndpointSideBar = ({ showAdd = true }: EndpointSideBarProps) => {
  const [showImport, setShowImport] = useState(false);
  const navigate = useNavigate();
  const { endpointId } = useParams();
  const location = useLocation();
  const { snifferId } = queryString.parse(location.search);
  const { endpoints } = useSniffersStore();

  const handleImportClicked = () => {
    setShowImport(true);
  };

  return (
    <>
      {showAdd && (
        <div className="border-b border-border-color pb-2 mb-2">
          <div
            className={`flex flex-row w-full hover:bg-primary  cursor-pointer active:bg-tertiary items-center rounded-md`}
            onClick={() =>
              navigate(routes.CREATE_ENDPOINT + `?snifferId=${snifferId}`)
            }
          >
            <div className="flex text-sm overflow-ellipsis whitespace-nowrap items-center p-2 gap-2">
              <AiOutlinePlus className="text-blue-500 text-xl h-[25px] w-[25px]" />
              <div>New Request</div>
            </div>
          </div>
          <div
            className={`flex flex-row w-full hover:bg-primary  cursor-pointer active:bg-tertiary items-center rounded-md gap-10`}
            onClick={handleImportClicked}
          >
            <div className="flex text-sm max-w-full overflow-ellipsis whitespace-nowrap items-center p-2 gap-2">
              <UploadFileIcon className="text-blue-500 text-xl h-[25px] w-[25px]" />
              Import Request
            </div>
          </div>
        </div>
      )}

      {showImport && (
        <ImportRequestModal
          onClose={() => {
            setShowImport(false);
          }}
          snifferId={(snifferId as string) ?? ""}
        />
      )}

      {endpoints.map((endpoint) => {
        return (
          <Endpoint
            isSelected={endpoint.id === endpointId}
            onClick={() =>
              navigate(`/endpoints/${endpoint.id}` + `?snifferId=${snifferId}`)
            }
            key={endpoint.id}
            method={endpoint.method}
            url={endpoint.url}
          />
        );
      })}
    </>
  );
};

const ImportRequestModal = ({
  onClose,
  snifferId,
}: {
  onClose: () => void;
  snifferId: string;
}) => {
  const [value, setValue] = useState("");
  const { show: showSnackbar, component: snackBar } = useSnackbar();

  const handleImportClicked = () => {
    importRequestFromCurl(snifferId, value)
      .then(() => {
        showSnackbar("Imported successfully", "success");
      })
      .catch(() => {
        showSnackbar("Failed to import", "error");
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
        <div className="mb-4 flex ">
          <Typography variant="h6">Import a Request from Curl</Typography>
        </div>
        <div className="w-full border-b-[0.05px] my-4" />
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
        <div className="flex justify-end pt-5">
          <Button
            onClick={handleImportClicked}
            variant="contained"
            color="primary"
          >
            import
          </Button>
        </div>
      </Paper>
    </Modal>
  );
};
