import { TextField, Tooltip } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { InvocationType } from "./types";
import { InvocationDetails } from "./InvocationDetails";
import { useEffect, useState } from "react";
import { LoadingIcon } from "./LoadingIcon";
import { SelectMethodDropDown } from "../mocks/SelectMethodDropDown";
import { useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useSniffersStore } from "../../stores/sniffersStores";
import { BackendAxios } from "../../api/backendAxios";
import queryString from "query-string";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { useMockStore } from "../../stores/mockStore";
import { useSnackbar } from "../../hooks/useSnackbar";

type InvocationUpperBarProps = {
  activeInvocation?: InvocationType;
};

export const InvocationUpperBar = ({
  activeInvocation,
}: InvocationUpperBarProps) => {
  const [editedInvocation, setEditedInvocation] = useState<InvocationType>({
    method: "GET",
    url: "/",
    headers: {},
    body: "",
    response: {
      headers: {},
      body: "",
      status: 0,
    },
  } as InvocationType);
  const location = useLocation();
  const { endpointId } = useParams();
  const [loading, setLoading] = useState(false);
  const { snifferId } = queryString.parse(location.search);
  const { executeInvocation, loadingExecution } = useSniffersStore();
  const [defaultTab, setDefaultTab] = useState("1");
  const { sniffers } = useSniffersStore();
  const { createMock } = useMockStore();
  const { show, component } = useSnackbar();
  const sniffer = sniffers.find(
    (s) => s.id === snifferId || s.id === editedInvocation.snifferId
  );
  const navigator = useNavigate();

  useEffect(() => {
    if (activeInvocation) {
      BackendAxios.get(`/invocation/${activeInvocation.id}`).then((res) => {
        if (res) {
          setEditedInvocation(res.data);
        }
      });
    } else {
      if (endpointId != null) {
        setLoading(true);
        BackendAxios.get(`/request/${endpointId}`)
          .then((res) => {
            if (res) {
              setEditedInvocation(res.data);
            }
          })
          .finally(() => setLoading(false));
      }
    }
  }, [endpointId, activeInvocation]);

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
          return {
            ...prevState,
            response: {
              ...prevState.response,
              status: res?.status || 0,
              headers: res?.headers || {},
              body: res?.body || "",
            },
          };
        });
        setDefaultTab("3");
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
      {loading ? (
        <LoadingIcon />
      ) : (
        <>
          <div className="flex flex-row items-center space-x-2">
            {component}
            <div className="flex flex-row items-center w-28">
              <SelectMethodDropDown
                disabled={activeInvocation !== undefined}
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
              disabled={activeInvocation !== undefined}
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
            {editedInvocation && (
              <InvocationDetails
                defaultTab={defaultTab}
                invocation={editedInvocation}
                setInvocation={setEditedInvocation}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};
