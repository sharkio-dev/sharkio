import { TextField } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { selectIconByMethod } from "./selectIconByMethod";
import { InvocationType } from "./types";
import { InvocationDetails } from "./InvocationDetails";
import { SnifferType } from "../../stores/sniffersStores";
import { executeInvocation } from "../../api/api";
import { useEffect, useState } from "react";
import { LoadingIcon } from "./LoadingIcon";
import { SelectComponent } from "../test-suites/SelectComponent";

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
        <div className="flex flex-row items-center w-40">
          <SelectComponent
            options={[
              { value: "GET", label: "GET" },
              { value: "POST", label: "POST" },
              { value: "PUT", label: "PUT" },
              { value: "PATCH", label: "PATCH" },
              { value: "DELETE", label: "DELETE" },
            ]}
            title="Method"
            value={editedInvocation?.method || ""}
            setValue={(value) => {
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
