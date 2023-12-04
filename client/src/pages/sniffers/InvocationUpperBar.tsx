import { TextField } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { InvocationType } from "./types";
import { InvocationDetails } from "./InvocationDetails";
import { useEffect, useState } from "react";
import { LoadingIcon } from "./LoadingIcon";
import { SelectMethodDropDown } from "../mocks/SelectMethodDropDown";
import { useParams } from "react-router-dom";
import { useSniffersStore } from "../../stores/sniffersStores";

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

  useEffect(() => {
    activeInvocation && setEditedInvocation(activeInvocation);
  }, [activeInvocation]);

  const executeRequest = () => {
    if (!editedInvocation) {
      return;
    }
    if (!snifferId) {
      return;
    }
    executeInvocation({ ...editedInvocation, snifferId }).then((res) => {
      if (res) {
        console.log({ res });
        console.log({ body: res?.data });
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

  return (
    <>
      <div className="flex flex-row items-center space-x-4">
        <div className="flex flex-row items-center w-40">
          <SelectMethodDropDown
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
