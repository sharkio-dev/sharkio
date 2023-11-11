import { TextField, Tooltip } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { selectIconByMethod } from "./selectIconByMethod";
import { InvocationType } from "./types";
import { InvocationDetails } from "./InvocationDetails";
import { MdDomain } from "react-icons/md";
import { SnifferType } from "../../stores/sniffersStores";
import { executeInvocation } from "../../api/api";
import { useState } from "react";
import { LoadingIcon } from "./LoadingIcon";

type InvocationUpperBarProps = {
  activeInvocation?: InvocationType;
  activeSniffer?: SnifferType;
  refresh?: () => void;
};

const domainPath = (subdomain: string) => {
  return `https://${subdomain}.localhost.sharkio.dev`;
};

export const InvocationUpperBar = ({
  activeInvocation,
  activeSniffer,
  refresh,
}: InvocationUpperBarProps) => {
  const [loading, setLoading] = useState(false);
  const onExecute = () => {
    if (!activeInvocation) {
      return;
    }
    setLoading(true);
    executeInvocation(activeInvocation)
      .then(() => {
        refresh && refresh();
      })
      .catch(() => {
        refresh && refresh();
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      {activeSniffer && (
        <Tooltip title="Sniffer's domain" placement="top" arrow>
          <div className="flex flex-row items-center space-x-4 mb-4">
            <MdDomain className="text-blue-500 text-2xl p-1" />
            <div className="text-sm text-gray-500">
              {domainPath(activeSniffer.subdomain)}
            </div>
          </div>
        </Tooltip>
      )}
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
            onClick={onExecute}
          />
        )}
      </div>
      <div className="flex flex-row space-x-4 mt-4 flex-1">
        <InvocationDetails invocation={activeInvocation} />
      </div>
    </>
  );
};
