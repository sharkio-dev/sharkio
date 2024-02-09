import { useState } from "react";
import GenericEditingModal from "../../components/project-selection/GenericEditingModal";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useFlowStore } from "../../stores/flowStore";
import { FlowSelector } from "../flows/TestsTab";
import { InvocationType } from "../sniffers/types";
interface ImportTestStepDialogProps {
  open: boolean;
  handleClose: () => void;
  invocation?: InvocationType;
}

export const ImportTestStepDialog: React.FC<ImportTestStepDialogProps> = ({
  open,
  handleClose,
  invocation,
}) => {
  const { component: snackBar, show } = useSnackbar();
  const { postNode } = useFlowStore();
  const [selectedFlowId, setSelectedFlowId] = useState<string | undefined>(
    undefined,
  );

  const handleImportInvocation = () => {
    if (!selectedFlowId || invocation == null) return;

    postNode(selectedFlowId, {
      body: invocation.body,
      method: invocation.method,
      headers: invocation.headers,
      url: invocation.url,
      proxyId: invocation.snifferId,
      name: `${invocation.method} ${invocation.url} - imported`,
      assertions: [
        {
          expectedValue: `${invocation.response.status}`,
          comparator: "eq",
          path: "status",
          type: "number",
        },
      ],
      type: "http",
    })
      .then(() => {
        show("Request imported successfully", "success");
        handleClose();
      })
      .catch(() => {
        show("Failed to import request", "error");
      });
  };

  return (
    <>
      {snackBar}
      <GenericEditingModal
        modalProps={{
          open: open,
          onClose: () => {
            handleClose();
          },
        }}
        paperHeadLine="Import request to test"
        acceptButtonProps={{ onClick: handleImportInvocation }}
        acceptButtonValue="import"
        cancelButtonProps={{ onClick: () => handleClose() }}
        cancelButtonValue="Cancel"
        isLoading={false}
      >
        <FlowSelector
          flowId={selectedFlowId}
          onFlowSelected={setSelectedFlowId}
        />
      </GenericEditingModal>
    </>
  );
};
