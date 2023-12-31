import { Radio, Tooltip } from "@mui/material";
import React from "react";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { Mock, MockResponse } from "../../stores/mockStore";
import { selectIconByStatus } from "../sniffers/Invocation";
import { MockResponseDetails } from "./MockResponseDetails";
import { SelectComponent } from "../../components/select-component/SelectComponent";

interface MockResponsesSectionProps {
  handleMockResponsesChange: (responses: MockResponse[]) => void;
  mock: Mock;
  handleMockChange: (mock: Mock) => void;
  handleAddMockResponse: () => void;
  handleDeleteMockResponse: (responseId: string) => void;
}
export const MockResponsesSection: React.FC<MockResponsesSectionProps> = ({
  handleMockResponsesChange,
  mock,
  handleMockChange,
  handleAddMockResponse,
  handleDeleteMockResponse,
}) => {
  const [openResponseId, setOpenResponseId] = React.useState<string>();
  const dragResponnseRef = React.useRef<number>(0);
  const dragOverResponseRef = React.useRef<number>(0);

  const handleSort = () => {
    const newResponses = mock.mockResponses ? [...mock.mockResponses] : [];
    const draggedResponse = newResponses[dragResponnseRef.current];
    newResponses.splice(dragResponnseRef.current, 1);
    newResponses.splice(dragOverResponseRef.current, 0, draggedResponse);
    newResponses.forEach((r, i) => {
      r.sequenceIndex = i;
      r.name = `Response ${i + 1}`;
    });
    handleMockResponsesChange(newResponses);
  };

  return (
    <div className="flex-col">
      <div className="flex flex-row items-center justify-between border-b border-border-color">
        <div
          className="flex flex-row items-center space-x-2 px-2 my-2 w-40 cursor-pointer select-none"
          onClick={handleAddMockResponse}
        >
          <AiOutlinePlus className="flex text-green-400 hover:bg-border-color rounded-md hover:cursor-pointer" />
          <span className="hover:text-green-400">Add Response</span>
        </div>
        <div className="w-40 py-2">
          <SelectComponent
            title="Algorithm"
            options={[
              { label: "Default", value: "default" },
              { label: "Sequence", value: "sequence" },
              { label: "Random", value: "random" },
            ]}
            value={mock.responseSelectionMethod}
            setValue={(value) => {
              handleMockChange({ ...mock, responseSelectionMethod: value });
            }}
          />
        </div>
      </div>
      {mock.mockResponses.map((r, i) => (
        <div
          className="flex flex-col border border-border-color p-4 mt-4 shadow-md hover:border-blue-400 cursor-grab rounded-md min-h-[64px] active:cursor-grabbing"
          key={i}
          draggable
          onDragStart={() => (dragResponnseRef.current = i)}
          onDragEnter={() => (dragOverResponseRef.current = i)}
          onDragEnd={handleSort}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center space-x-2">
              <Tooltip title="Select as default response">
                <Radio
                  checked={r.id === mock.selectedResponseId}
                  onClick={() => {
                    handleMockChange({ ...mock, selectedResponseId: r.id });
                  }}
                />
              </Tooltip>
              {selectIconByStatus(r.status)}
              <div className="flex flex-row items-center space-x-2">
                <span>{r.name}</span>
              </div>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <AiOutlineDelete
                className=" text-red-400 active:scale-110 text-lg cursor-pointer ml-4 hover:bg-border-color rounded-md"
                onClick={() => {
                  handleDeleteMockResponse(r.id);
                }}
              />
              <IoIosArrowForward
                className={`active:scale-110 text-lg cursor-pointer ml-4 hover:bg-border-color rounded-md ${
                  openResponseId === r.id ? "rotate-90" : ""
                }`}
                onClick={() => {
                  if (openResponseId === r.id) {
                    setOpenResponseId(undefined);
                    return;
                  }
                  setOpenResponseId(r.id);
                }}
              />
            </div>
          </div>
          {openResponseId === r.id && (
            <MockResponseDetails
              response={r}
              handleResponseChange={(value: MockResponse) => {
                handleMockResponsesChange(
                  mock.mockResponses.map((r, i) => {
                    if (r.id === value.id) {
                      value.name = `Response ${i + 1}`;
                      return value;
                    }
                    return r;
                  }),
                );
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
