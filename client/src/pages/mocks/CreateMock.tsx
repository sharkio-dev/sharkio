import React from "react";
import { useNavigate } from "react-router-dom";
import { Mock, MockResponse, useMockStore } from "../../stores/mockStore";
import { SnifferType } from "../../stores/sniffersStores";
import { getSnifferDomain } from "../../utils/getSnifferUrl";
import { MockButton } from "./MockButton";
import { MockUrlInput } from "./MockUrlInput";
import { v4 as uuidv4 } from "uuid";
import { MockResponsesSection } from "./MockResponsesSection";

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
    createMock(sniffer.id as string, newMock).then(async (res: any) => {
      await patchSelectedResponseId(res?.id, newMock.selectedResponseId);
      navigator(`/mocks/${res?.id}?snifferId=${sniffer.id}`);
    });
  };

  const handleUrlChange = (value: string) => {
    setEditedMock((prev) => ({ ...prev, url: value }));
  };

  const handleMethodChange = (value: string) => {
    setEditedMock((prev) => ({ ...prev, method: value }));
  };

  const onDeleteResponse = (responseId: string) => {
    setEditedMock((prev) => ({
      ...prev,
      mockResponses: prev.mockResponses
        ? prev.mockResponses.filter((r) => r.id !== responseId)
        : [],
    }));
  };

  const onAddResponse = () => {
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
      <div className="flex flex-row items-center space-x-4 border-b border-border-color pb-4">
        <MockUrlInput
          method={editedMock.method}
          url={editedMock.url}
          handleUrlChange={handleUrlChange}
          handleMethodChange={handleMethodChange}
          snifferDomain={getSnifferDomain(sniffer?.subdomain || "")}
        />
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
