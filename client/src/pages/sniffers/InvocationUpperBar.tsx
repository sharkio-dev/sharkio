import { TextField } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { selectIconByMethod } from "./selectIconByMethod";
import { EndpointType, InvocationType } from "./types";
import { InvocationDetails } from "./InvocationDetails";

type InvocationUpperBarProps = {
  activeInvocation?: InvocationType;
};
export const InvocationUpperBar = ({
  activeInvocation,
}: InvocationUpperBarProps) => {
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
        <PlayArrow className="text-green-500 cursor-pointer" />
      </div>
      <div className="flex flex-row space-x-4 mt-4 flex-1">
        <InvocationDetails invocation={activeInvocation} />
      </div>
    </>
  );
};
