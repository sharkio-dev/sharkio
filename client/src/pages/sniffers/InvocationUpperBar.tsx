import { TextField, Tooltip } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { selectIconByMethod } from "./selectIconByMethod";
import { EndpointType, InvocationType } from "./types";
import { InvocationDetails } from "./InvocationDetails";
import { MdDomain } from "react-icons/md";
import { Sniffer } from "../../stores/sniffersStores";

type InvocationUpperBarProps = {
  activeInvocation?: InvocationType;
  activeSniffer?: Sniffer;
};

const domainPath = (subdomain: string) => {
  return `https://${subdomain}.localhost.sharkio.dev`;
};

export const InvocationUpperBar = ({
  activeInvocation,
  activeSniffer,
}: InvocationUpperBarProps) => {
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
        <PlayArrow className="text-green-500 cursor-pointer" />
      </div>
      <div className="flex flex-row space-x-4 mt-4 flex-1">
        <InvocationDetails invocation={activeInvocation} />
      </div>
    </>
  );
};
