import { PlayArrow } from "@mui/icons-material";
import { TextField, Tooltip } from "@mui/material";
import queryString from "query-string";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BackendAxios } from "../../api/backendAxios";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useSniffersStore } from "../../stores/sniffersStores";
import { getSnifferDomain } from "../../utils/getSnifferUrl";
import { SelectMethodDropDown } from "../mocks/SelectMethodDropDown";
import { InvocationDetails } from "../sniffers/InvocationDetails";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { ProxySelector } from "../sniffers/SniffersSideBar";
import { InvocationType } from "../sniffers/types";
import { InputWithWizard } from "../flows/InputWithWizard";
import { MdOutlineNetworkPing } from "react-icons/md";
import { ImportToFlowDialog } from "./ImportToFlowDialog";

type InvocationSectionProps = {
  setEditedInvocation: React.Dispatch<
    React.SetStateAction<InvocationType | undefined>
  >;
  invocation?: InvocationType | undefined;
  isDisabled?: boolean;
  showUrlButtons?: boolean;
};

export const InvocationSection = ({
  invocation,
  setEditedInvocation,
  isDisabled = true,
  showUrlButtons = true,
}: InvocationSectionProps) => {
  return (
    <div>
      <InvocationURL
        showUrlButtons={showUrlButtons}
        invocation={invocation}
        setEditedInvocation={setEditedInvocation}
        isDisabled={isDisabled}
      />
      <InvocationDetails
        invocation={invocation as InvocationType}
        setInvocation={setEditedInvocation}
      />
    </div>
  );
};

export const InvocationURL: React.FC<InvocationSectionProps> = ({
  invocation,
  setEditedInvocation,
  isDisabled,
  showUrlButtons = true,
}) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [isImportStepDialogOpen, setIsImportStepDialogOpen] = useState(false);
  const { snifferId } = queryString.parse(location.search);
  const { executeInvocation, loadingExecution } = useSniffersStore();
  const { sniffers } = useSniffersStore();
  const { show, component } = useSnackbar();
  const sniffer = sniffers.find(
    (s) => s.id === snifferId || s.id === invocation?.snifferId,
  );
  const navigator = useNavigate();

  const executeRequest = () => {
    if (!invocation) {
      return;
    }
    const sid = (snifferId as string) || invocation.snifferId;
    if (!sid) {
      return;
    }
    executeInvocation({ ...invocation, snifferId: sid }).then((res) => {
      if (res) {
        setEditedInvocation((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              response: {
                ...prevState.response,
                status: res?.status || "",
                headers: res?.headers || {},
                body: res?.body || "",
              },
            };
          }
        });
      }
    });
  };

  const importMock = () => {
    if (!sniffer || !invocation || !invocation.response) {
      return;
    }
    setLoading(true);
    return BackendAxios.post("/mocks/import-from-invocation", {
      requestId: invocation.id,
    })
      .then((res) => {
        navigator(`/mocks/${res?.data?.id}?snifferId=${sniffer.id}`);
      })
      .catch(() => {
        show("Failed to import mock", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-row items-center space-x-[2px]">
      {component}
      <URLComponent
        onMethodChange={(value) => {
          if (invocation) {
            setEditedInvocation({
              ...invocation,
              method: value,
            });
          }
        }}
        onUrlChange={(value) => {
          if (invocation) {
            setEditedInvocation({
              ...invocation,
              url: value,
            });
          }
        }}
        method={invocation?.method || ""}
        url={invocation?.url || ""}
        snifferId={invocation?.snifferId || (snifferId as string)}
        onSnifferChange={(value) => {
          if (invocation) {
            setEditedInvocation({
              ...invocation,
              snifferId: value,
            });
          }
        }}
        isSnifferDisabled={isDisabled}
        isMethodDisabled={isDisabled}
        isUrlDisabled={isDisabled}
      />

      <div className="flex flex-row items-center justify-between h-full">
        {showUrlButtons && (
          <>
            <div className="flex flex-row items-center min-w-[24px] w-[24px] h-full ml-2">
              <Tooltip title="Mock Request">
                <div onClick={importMock}>
                  {loading ? (
                    <LoadingIcon />
                  ) : (
                    <MdOutlineNetworkPing className="text-yellow-500 cursor-pointer" />
                  )}
                </div>
              </Tooltip>
            </div>
            <div className="flex flex-row items-center min-w-[24px] w-[24px] h-full">
              <ImportToFlowDialog
                setIsImportStepDialogOpen={setIsImportStepDialogOpen}
                isImportStepDialogOpen={isImportStepDialogOpen}
                invocation={invocation || []}
              />
            </div>
            <div className="flex flex-row items-center min-w-[24px] w-[24px] h-full">
              <Tooltip title="Execute Request">
                <div>
                  {loadingExecution ? (
                    <LoadingIcon />
                  ) : (
                    <PlayArrow
                      className="text-green-500 cursor-pointer"
                      onClick={executeRequest}
                    />
                  )}
                </div>
              </Tooltip>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface URLComponentProps {
  onMethodChange?: (value: string) => void;
  onUrlChange?: (value: string) => void;
  method: string;
  url: string;
  snifferId: string;
  onSnifferChange?: (value: string) => void;
  isSnifferDisabled?: boolean;
  isMethodDisabled?: boolean;
  isUrlDisabled?: boolean;
  showWizard?: boolean;
}

export const URLComponent: React.FC<URLComponentProps> = ({
  onMethodChange,
  onUrlChange,
  method,
  url,
  snifferId,
  onSnifferChange,
  isSnifferDisabled,
  isMethodDisabled,
  isUrlDisabled,
  showWizard = false,
}) => {
  const { sniffers } = useSniffersStore();
  const sniffer = sniffers.find((s) => s.id === snifferId);

  const snifferUrl = sniffer == null ? "" : getSnifferDomain(sniffer.subdomain);

  return (
    <div className="flex flex-row items-center space-x-[2px] w-full">
      <div className="flex flex-row items-center w-28">
        <SelectMethodDropDown
          disabled={isMethodDisabled}
          value={method}
          onChange={(value) => {
            onMethodChange && onMethodChange(value);
          }}
        />
      </div>
      <div className="flex flex-row items-center w-[200px]">
        <Tooltip title={snifferUrl} placement="top">
          <div className="flex flex-row items-center w-full">
            <ProxySelector
              onSnifferSelected={onSnifferChange}
              snifferId={snifferId}
              isDisabled={isSnifferDisabled}
            />
          </div>
        </Tooltip>
      </div>
      {!showWizard && (
        <TextField
          disabled={isUrlDisabled}
          value={url}
          onChange={(e: any) => {
            onUrlChange && onUrlChange(e.target.value);
          }}
          variant="outlined"
          size="small"
          style={{ width: "100%" }}
        />
      )}
      {showWizard && (
        <InputWithWizard
          inputProps={{
            value: url,
            onChange: (e: any) => onUrlChange && onUrlChange(e.target.value),
          }}
          handleWizardSelection={(value) => {
            onUrlChange && onUrlChange(url + value);
          }}
        />
      )}
    </div>
  );
};
