import { TextField } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { selectIconByMethod } from "./selectIconByMethod";
import { InvocationType } from "./types";
import { InvocationDetails } from "./InvocationDetails";
import { SnifferType } from "../../stores/sniffersStores";
import { executeInvocation } from "../../api/api";
import { useEffect, useState } from "react";
import { LoadingIcon } from "./LoadingIcon";

type InvocationUpperBarProps = {
  activeInvocation?: InvocationType;
  activeSniffer?: SnifferType;
  onExecuteRequest?: () => void;
};

export const InvocationUpperBar = ({
  activeInvocation,
  onExecuteRequest,
}: InvocationUpperBarProps) => {
  const [loading, setLoading] = useState(false);
  const [editedInvocation, setEditedInvocation] = useState<InvocationType>();

  useEffect(() => {
    activeInvocation && setEditedInvocation(activeInvocation);
  }, [activeInvocation]);

  const executeRequest = () => {
    if (!editedInvocation) {
      return;
    }
    setLoading(true);
    executeInvocation(editedInvocation)
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
        {selectIconByMethod(editedInvocation?.method || "GET")}
        <TextField
          label={editedInvocation?.url}
          variant="outlined"
          size="small"
          style={{ width: "100%" }}
          disabled
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
