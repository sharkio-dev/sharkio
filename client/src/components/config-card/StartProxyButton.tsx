import { PlayArrow, Stop } from "@mui/icons-material";
import { ConfigButton } from "./ConfigButton";

export const StartProxyButton = ({
  onStart,
  disabled,
  onStop,
  isStarted,
  isLoading,
}: {
  onStart: () => void;
  disabled: boolean;
  onStop: () => void;
  isStarted: boolean;
  isLoading?: boolean;
}) => {
  const onStartClick = async () => {
    onStart();
  };

  const onStopClick = async () => {
    onStop();
  };

  return (
    <>
      {!isStarted && (
        <ConfigButton
          tooltip={"Start sniffing requests"}
          onClick={onStartClick}
          disabled={disabled}
          isLoading={isLoading}
        >
          <PlayArrow color={disabled ? "disabled" : "success"} />
        </ConfigButton>
      )}
      {isStarted && (
        <ConfigButton
          tooltip={"Stop sniffing requests"}
          onClick={onStopClick}
          disabled={disabled}
          isLoading={isLoading}
        >
          <Stop color={disabled ? "disabled" : "error"} />
        </ConfigButton>
      )}
    </>
  );
};
