import { PlayArrow } from "@mui/icons-material";
import { TextField, Tooltip } from "@mui/material";
import queryString from "query-string";
import { useState } from "react";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useMockStore } from "../../stores/mockStore";
import { useSniffersStore } from "../../stores/sniffersStores";
import { SelectMethodDropDown } from "../mocks/SelectMethodDropDown";
import { InvocationDetails } from "./InvocationDetails";
import { LoadingIcon } from "./LoadingIcon";
import { EndpointType, InvocationType } from "./types";

type InvocationUpperBarProps = {
  setEditedInvocation: React.Dispatch<
    React.SetStateAction<EndpointType | undefined>
  >;
  activeInvocation?: InvocationType | EndpointType | undefined;
  isDisabled?: boolean;
  showResponseTab?: boolean;
};

export const InvocationUpperBar = ({
  activeInvocation: editedInvocation,
  setEditedInvocation,
  isDisabled = true,
  showResponseTab = true,
}: InvocationUpperBarProps) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { snifferId } = queryString.parse(location.search);
  const { executeInvocation, loadingExecution } = useSniffersStore();
  const { sniffers } = useSniffersStore();
  const { createMock } = useMockStore();
  const { show, component } = useSnackbar();
  const sniffer = sniffers.find(
    (s) => s.id === snifferId || s.id === editedInvocation?.snifferId,
  );
  const navigator = useNavigate();

  const executeRequest = () => {
    if (!editedInvocation) {
      return;
    }
    const sid = (snifferId as string) || editedInvocation.snifferId;
    if (!sid) {
      return;
    }
    executeInvocation({ ...editedInvocation, snifferId: sid }).then((res) => {
      if (res) {
        setEditedInvocation((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              response: {
                ...prevState.response,
                status: res?.status || 0,
                headers: res?.headers || {},
                body: res?.body || "",
              },
            };
          }
        });
      }
    });
  };

  const importMock = () => {
    if (!sniffer || !editedInvocation || !editedInvocation.response) {
      return;
    }
    setLoading(true);
    return createMock(sniffer.id, {
      method: editedInvocation?.method,
      url: editedInvocation?.url,
      headers: editedInvocation?.response?.headers as Record<string, string>,
      body: editedInvocation?.response?.body,
      status: editedInvocation?.response?.status?.toString(),
      isActive: true,
    })
      .then((res) => {
        navigator(`/mocks/${res?.id}?snifferId=${sniffer.id}`);
      })
      .catch(() => {
        show("This endpoint already has a mock", "warning");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const snifferUrl = `https://${sniffer?.subdomain}.${
    import.meta.env.VITE_PROXY_DOMAIN
  }`;
  return (
    <>
      <div className="flex flex-row items-center space-x-2">
        {component}
        <div className="flex flex-row items-center w-28">
          <SelectMethodDropDown
            disabled={isDisabled}
            value={editedInvocation?.method || ""}
            onChange={(value: string) => {
              if (editedInvocation) {
                setEditedInvocation({
                  ...editedInvocation,
                  method: value,
                });
              }
            }}
          />
        </div>
        {sniffer && (
          <div className="flex flex-row items-center w-[550px]">
            <TextField
              disabled={true}
              value={snifferUrl}
              variant="outlined"
              size="small"
              style={{ width: "100%" }}
            />
          </div>
        )}
        <TextField
          disabled={isDisabled}
          value={editedInvocation?.url}
          onChange={(e: any) => {
            if (editedInvocation) {
              setEditedInvocation({
                ...editedInvocation,
                url: e.target.value,
              });
            }
          }}
          variant="outlined"
          size="small"
          style={{ width: "100%" }}
        />
        <div className="flex flex-row items-center justify-between h-full">
          <div className="flex flex-row items-center min-w-[24px] w-[24px] h-full">
            <Tooltip title="Mock Request">
              <div onClick={importMock}>
                {loading ? (
                  <LoadingIcon />
                ) : (
                  <HiOutlineClipboardDocumentList className="text-yellow-500 cursor-pointer" />
                )}
              </div>
            </Tooltip>
          </div>
          <div className="flex flex-row items-center min-w-[24px] w-[24px] h-full">
            <Tooltip title="Execute Request">
              <div>
                {loadingExecution ? (
                  <LoadingIcon />
                ) : (
                  <PlayArrow
                    className="text-green-500 cursor-pointer"
                    onClick={executeRequest}
                  />
                )}
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="flex flex-row space-x-4 mt-4 overflow-y-auto">
        <InvocationDetails
          showResponseTab={showResponseTab}
          invocation={editedInvocation}
          setInvocation={setEditedInvocation}
        />
      </div>
    </>
  );
};
