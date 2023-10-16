import { PlayArrow, Stop } from "@mui/icons-material";
import { CircularProgress, Tooltip } from "@mui/material";
import { useState } from "react";

export const StartProxyButton = ({
  onStart,
  disabled,
  onStop,
}: {
  onStart: () => void;
  disabled: boolean;
  onStop: () => void;
}) => {
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onStartClick = async () => {
    setIsLoading(true);
    onStart();
    setIsStarted(true);
    setIsLoading(false);
  };

  const onStopClick = async () => {
    setIsLoading(true);
    onStop();
    setIsStarted(false);
    setIsLoading(false);
  };

  return (
    <>
      {!isStarted && (
        <Tooltip title={"Start sniffing requests"}>
          <button
            onClick={onStartClick}
            disabled={disabled}
            className="px-1 cursor-pointer"
          >
            {isLoading ? (
              <CircularProgress />
            ) : (
              <PlayArrow color={disabled ? "disabled" : "success"} />
            )}
          </button>
        </Tooltip>
      )}
      {isStarted && (
        <Tooltip title={"Stop sniffing requests"}>
          <button
            disabled={disabled}
            onClick={onStopClick}
            className="px-1 cursor-pointer"
          >
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Stop color={disabled ? "disabled" : "warning"} />
            )}
          </button>
        </Tooltip>
      )}
    </>
  );
};
