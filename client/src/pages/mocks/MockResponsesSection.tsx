import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { Mock, MockResponse } from "../../stores/mockStore";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { MockResponseCard } from "./MockResponseCard";

interface MockResponsesSectionProps {
  handleMockResponsesChange: (responses: MockResponse[]) => void;
  mock: Mock;
  handleMockChange: (mock: Mock) => void;
  handleAddMockResponse: () => Promise<void>;
  handleDuplicateMockResponse?: (
    mockToDuplicate: MockResponse,
  ) => Promise<void>;
  handleDeleteMockResponse: (responseId: string) => Promise<void>;
}
export const MockResponsesSection: React.FC<MockResponsesSectionProps> = ({
  handleMockResponsesChange,
  mock,
  handleMockChange,
  handleAddMockResponse,
  handleDeleteMockResponse,
  handleDuplicateMockResponse,
}) => {
  const [addingResponse, setAddingResponse] = React.useState<boolean>(false);
  const [openResponseId, setOpenResponseId] = React.useState<string>();
  const dragResponseRef = React.useRef<number>(0);
  const dragOverResponseRef = React.useRef<number>(0);

  const handleSort = () => {
    const newResponses = mock.mockResponses ? [...mock.mockResponses] : [];
    const draggedResponse = newResponses[dragResponseRef.current];
    newResponses.splice(dragResponseRef.current, 1);
    newResponses.splice(dragOverResponseRef.current, 0, draggedResponse);
    newResponses.forEach((r, i) => {
      r.sequenceIndex = i;
    });
    handleMockResponsesChange(newResponses);
  };

  return (
    <div className="flex-col">
      <div className="flex flex-row items-center justify-between border-b border-border-color">
        <div
          className="flex flex-row items-center space-x-2 px-2 my-2 w-40 cursor-pointer select-none "
          onClick={() => {
            setAddingResponse(true);
            handleAddMockResponse().finally(() => {
              setAddingResponse(false);
            });
          }}
        >
          {addingResponse ? (
            <LoadingIcon className="flex  hover:bg-border-color rounded-md hover:cursor-pointer" />
          ) : (
            <AiOutlinePlus className="flex text-blue-500 hover:text-green-400 hover:bg-border-color rounded-md hover:cursor-pointer" />
          )}
          <span className="hover:text-green-400">Add Response</span>
        </div>
      </div>
      {mock?.mockResponses?.map((mockResponse, index) => (
        <MockResponseCard
          mock={mock}
          mockResponse={mockResponse}
          dragResponseRef={dragResponseRef}
          dragOverResponseRef={dragOverResponseRef}
          onMockChange={handleMockChange}
          index={index}
          openResponseId={openResponseId}
          onSort={handleSort}
          onDeleteMockResponse={handleDeleteMockResponse}
          onDuplicateMockResponse={handleDuplicateMockResponse}
          onOpenResponse={(responseId: string) => {
            if (responseId === openResponseId) {
              setOpenResponseId(undefined);
            } else {
              setOpenResponseId(responseId);
            }
          }}
          onMockResponsesChange={handleMockResponsesChange}
        />
      ))}
    </div>
  );
};
