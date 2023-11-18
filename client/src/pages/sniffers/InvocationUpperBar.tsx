import { TextField, Tooltip } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { selectIconByMethod } from "./selectIconByMethod";
import { InvocationType } from "./types";
import { InvocationDetails } from "./InvocationDetails";
import { MdDomain } from "react-icons/md";
import { Sniffer } from "../../stores/sniffersStores";
import { executeInvocation } from "../../api/api";
import { useState } from "react";
import { LoadingIcon } from "./LoadingIcon";
import { AiOutlineCopy } from "react-icons/ai";

type InvocationUpperBarProps = {
  activeInvocation?: InvocationType;
  activeSniffer?: Sniffer;
  onExecuteRequest?: () => void;
};

const domainPath = (subdomain: string) => {
  return `https://${subdomain}.localhost.sharkio.dev`;
};

export const InvocationUpperBar = ({
  activeInvocation,
  activeSniffer,
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
      {activeSniffer && (
        <Tooltip
          onClick={() =>
            navigator.clipboard.writeText(domainPath(activeSniffer.subdomain))
          }
          title="Copy Sniffer's domain"
          placement="top"
          arrow
        >
          <div className="flex flex-row items-center space-x-4 mb-4 cursor-pointer">
            <MdDomain className="text-blue-500 text-2xl p-1" />
            <div className="text-sm text-gray-500">
              <span className="text-white ">Sniffer's Domain: </span>
              {domainPath(activeSniffer.subdomain)}
            </div>
            <AiOutlineCopy title="Copy domain" />
          </div>
        </Tooltip>

        //you want click to copy only on the icon or the text
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
