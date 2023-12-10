import { TextField } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { InvocationType } from "./types";
import { InvocationDetails } from "./InvocationDetails";
import { useEffect, useState } from "react";
import { LoadingIcon } from "./LoadingIcon";
import { SelectMethodDropDown } from "../mocks/SelectMethodDropDown";
import { useParams } from "react-router-dom";
import { useSniffersStore } from "../../stores/sniffersStores";
import { BackendAxios } from "../../api/backendAxios";

type InvocationUpperBarProps = {
  activeInvocation?: InvocationType;
};

export const InvocationUpperBar = ({
  activeInvocation,
}: InvocationUpperBarProps) => {
  const { snifferId } = useParams();
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
  const { executeInvocation, loadingExecution } = useSniffersStore();
  const [defaultTab, setDefaultTab] = useState("1");
  const { sniffers } = useSniffersStore();
  console.log(editedInvocation);
  const sniffer = sniffers.find(
    (s) => s.id === snifferId || s.id === editedInvocation.snifferId,
  );

  useEffect(() => {
    if (activeInvocation) {
      BackendAxios.get(`/invocation/${activeInvocation.id}`).then((res) => {
        if (res) {
          setEditedInvocation(res.data);
        }
      });
    }
  }, [activeInvocation]);

  const executeRequest = () => {
    if (!editedInvocation) {
      return;
    }
    const sid = snifferId || editedInvocation.snifferId;
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

  const snifferUrl = `https://${sniffer?.subdomain}.${
    import.meta.env.VITE_PROXY_DOMAIN
  }`;

  return (
    <>
      <div className="flex flex-row items-center space-x-4">
        <div className="flex flex-row items-center w-40">
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
        <TextField
          disabled={activeInvocation !== undefined}
          value={snifferUrl + editedInvocation?.url}
          onChange={(e: any) => {
            if (editedInvocation) {
              if (e.target.value.startsWith(snifferUrl + "/")) {
                setEditedInvocation({
                  ...editedInvocation,
                  url: e.target.value.replace(snifferUrl, ""),
                });
              }
            }
          }}
          variant="outlined"
          size="small"
          style={{ width: "100%" }}
        />
        {loadingExecution ? (
          <LoadingIcon />
        ) : (
          <PlayArrow
            className="text-green-500 cursor-pointer"
            onClick={executeRequest}
          />
        )}
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
  );
};
