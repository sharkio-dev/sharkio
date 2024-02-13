import React from "react";
import { useNavigate } from "react-router-dom";
import { Mock, MockResponse, useMockStore } from "../../stores/mockStore";
import { SnifferType } from "../../stores/sniffersStores";
import { MockButton } from "./MockButton";
import { v4 as uuidv4 } from "uuid";
import { MockResponsesSection } from "./MockResponsesSection";
import { useSnackbar } from "../../hooks/useSnackbar";
import { SelectComponent } from "../../components/select-component/SelectComponent";
import { URLComponent } from "../live-Invocations/LiveInvocationUpperBar";

interface CreateMockProps {
  sniffer: SnifferType;
  editedMock: Mock;
  setEditedMock: React.Dispatch<React.SetStateAction<Mock>>;
}
export const CreateMock: React.FC<CreateMockProps> = ({
  sniffer,
  editedMock,
  setEditedMock,
}) => {
  const navigator = useNavigate();
  const { show: showSnackbar, component: snackBar } = useSnackbar();

  const { createMock, loadingNewMock, patchSelectedResponseId } =
    useMockStore();

  const onClickSave = () => {
    let newMock = {
      ...editedMock,
      mockResponses: editedMock.mockResponses?.map((r, i) => ({
        ...r,
        sequenceIndex: i + 1,
      })),
      snifferId: sniffer.id as string,
      id: uuidv4(),
      isActive: true,
    };
    createMock(sniffer.id as string, newMock)
      .then(async (res: any) => {
        await patchSelectedResponseId(res?.id, newMock.selectedResponseId);
        navigator(`/mocks/${res?.id}?snifferId=${sniffer.id}`);
      })
      .catch(() => {
        showSnackbar("Error creating mock", "error");
      });
  };

  const handleUrlChange = (value: string) => {
    setEditedMock((prev) => ({ ...prev, url: value }));
  };

  const handleMethodChange = (value: string) => {
    setEditedMock((prev) => ({ ...prev, method: value }));
  };

  const onDeleteResponse = async (responseId: string) => {
    setEditedMock((prev) => ({
      ...prev,
      mockResponses: prev.mockResponses
        ? prev.mockResponses.filter((r) => r.id !== responseId)
        : [],
    }));
  };

  const handleSelectionMethodChanged = (selectionMethod: string) => {
    setEditedMock((prev) => {
      if (!prev) return prev;
      return { ...prev, responseSelectionMethod: selectionMethod };
    });
  };

  const onAddResponse = async () => {
    let index = editedMock.mockResponses ? editedMock.mockResponses.length : 0;
    const newResponse = {
      id: uuidv4(),
      name: `Response ${index + 1}`,
      body: "",
      status: 200,
      headers: {},
      sequenceIndex: index,
    };
    setEditedMock((prev) => ({
      ...prev,
      selectedResponseId:
        index === 0 ? newResponse.id : prev.selectedResponseId,
      mockResponses: prev.mockResponses
        ? [...prev.mockResponses, newResponse]
        : [newResponse],
    }));
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {snackBar}
      <div className="flex flex-row items-center space-x-4 border-b border-border-color pb-4">
        <URLComponent
          method={editedMock.method}
          url={editedMock.url}
          snifferId={editedMock.snifferId}
          onMethodChange={(value) => {
            handleMethodChange(value);
          }}
          onUrlChange={(value) => {
            handleUrlChange(value);
          }}
          isSnifferDisabled={true}
        />
        <div className="w-40 py-2">
          <SelectComponent
            title="Algorithm"
            options={[
              { label: "Default", value: "default" },
              { label: "Sequence", value: "sequence" },
              { label: "Random", value: "random" },
            ]}
            value={editedMock.responseSelectionMethod}
            setValue={(value) => {
              handleSelectionMethodChanged(value);
            }}
          />
        </div>
        <MockButton
          text="Create"
          onClick={onClickSave}
          isLoading={loadingNewMock}
        />
      </div>
      <MockResponsesSection
        mock={editedMock}
        handleMockChange={(value: Mock) => {
          setEditedMock(value);
        }}
        handleMockResponsesChange={(value: MockResponse[]) => {
          setEditedMock((prev) => ({ ...prev, mockResponses: value }));
        }}
        handleAddMockResponse={onAddResponse}
        handleDeleteMockResponse={onDeleteResponse}
      />
    </div>
  );
};
