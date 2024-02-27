import React, { useState } from "react";
import GenericEditingModal from "../../components/project-selection/GenericEditingModal";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useFlowStore } from "../../stores/flowStore";
import { FlowSelector } from "../flows/TestsTab";
import { InvocationType } from "../sniffers/types";

interface ImportTestStepDialogProps {
  open: boolean;
  handleClose: () => void;
  invocation?: InvocationType | InvocationType[]; // Updated type
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
    if (!selectedFlowId || !invocation) return;

    const invocationsArray = Array.isArray(invocation)
      ? invocation
      : [invocation];

    const importPromises = invocationsArray.map((singleInvocation) =>
      postNode(selectedFlowId, {
        body: singleInvocation.body,
        method: singleInvocation.method,
        headers: singleInvocation.headers,
        url: singleInvocation.url,
        proxyId: singleInvocation.snifferId,
        name: `${singleInvocation.method} ${singleInvocation.url} - imported`,
        assertions: [
          {
            expectedValue: `${singleInvocation.response.status}`,
            comparator: "eq",
            path: "status",
            type: "number",
          },
        ],
        type: "http",
      }),
    );

    Promise.all(importPromises)
      .then(() => {
        show("Requests imported successfully", "success");
        handleClose();
      })
      .catch(() => {
        show("Failed to import requests", "error");
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
        paperHeadLine={`Import request to test - ${
          Array.isArray(invocation) ? "Multiple" : "Single"
        }`}
        acceptButtonProps={{ onClick: handleImportInvocation }}
        acceptButtonValue="Import"
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
