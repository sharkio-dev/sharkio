import { TextField } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { selectIconByMethod } from "./selectIconByMethod";
import { InvocationType } from "./types";
import { InvocationDetails } from "./InvocationDetails";
import { SnifferType } from "../../stores/sniffersStores";
import { executeInvocation } from "../../api/api";
import { useState } from "react";
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
  const executeRequest = () => {
    if (!activeInvocation) {
      return;
    }
    setLoading(true);
    executeInvocation(activeInvocation)
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
        {selectIconByMethod(activeInvocation?.method || "GET")}
        <TextField
          label={activeInvocation?.url}
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
      <div className="flex flex-row space-x-4 mt-4 flex-1">
        <InvocationDetails invocation={activeInvocation} />
      </div>
    </>
  );
};
