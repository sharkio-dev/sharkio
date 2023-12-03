import { TextField } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { InvocationType } from "./types";
import { InvocationDetails } from "./InvocationDetails";
import { executeInvocation } from "../../api/api";
import { useEffect, useState } from "react";
import { LoadingIcon } from "./LoadingIcon";
import { SelectMethodDropDown } from "../mocks/SelectMethodDropDown";
import { useParams } from "react-router-dom";

type InvocationUpperBarProps = {
  activeInvocation?: InvocationType;
  onExecuteRequest?: () => void;
};

export const InvocationUpperBar = ({
  activeInvocation,
  onExecuteRequest,
}: InvocationUpperBarProps) => {
  const [loading, setLoading] = useState(false);
  const { snifferId } = useParams();
  const [editedInvocation, setEditedInvocation] = useState<InvocationType>({
    method: "GET",
    url: "",
    headers: {},
    body: "",
  } as InvocationType);

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
    setLoading(true);
    executeInvocation({ ...editedInvocation, snifferId })
      .then(() => {
        onExecuteRequest && onExecuteRequest();
      })
      .catch(() => {
        onExecuteRequest && onExecuteRequest();
      })
      .finally(() => {
        setLoading(false);
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
        {loading ? (
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
            invocation={editedInvocation}
            setInvocation={setEditedInvocation}
          />
        )}
      </div>
    </>
  );
};
