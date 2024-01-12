import { Save } from "@mui/icons-material";
import { HiOutlineDuplicate } from "react-icons/hi";

import { IconButton, Input, Radio, Tooltip } from "@mui/material";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import {
  Mock,
  MockResponse,
  useMockResponseStore,
} from "../../stores/mockStore";
import { selectIconByStatus } from "../sniffers/Invocation";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { MockResponseDetails } from "./MockResponseDetails";

interface IMockResponseCard {
  mock: Mock;
  mockResponse: MockResponse;
  dragResponseRef: any;
  dragOverResponseRef: any;
  onMockChange: any;
  index: number;
  onSort: any;
  onDeleteMockResponse: (responseId: string) => Promise<void>;
  onDuplicateMockResponse?: (mockToDuplicate: MockResponse) => Promise<void>;
  onOpenResponse: any;
  onMockResponsesChange: any;
  openResponseId?: string | null;
}
export const MockResponseCard: React.FC<IMockResponseCard> = ({
  mock,
  mockResponse,
  dragResponseRef,
  dragOverResponseRef,
  onMockChange,
  index,
  openResponseId,
  onSort,
  onDeleteMockResponse,
  onOpenResponse,
  onMockResponsesChange,
  onDuplicateMockResponse,
}) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [editName, setEditName] = useState<boolean>(false);
  const [name, setName] = useState<string>(mockResponse.name);
  const { editMockResponse } = useMockResponseStore();
  const isSelected = mockResponse.id === mock.selectedResponseId;

  const handleSaveNameClicked = () => {
    setIsSaving(true);
    editMockResponse(mockResponse.id, {
      ...mockResponse,
      name,
    })
      .then(() => {
        onMockResponsesChange(
          mock.mockResponses.map((r) => {
            const newMockResponse = { ...r };

            if (r.id === mockResponse.id) {
              newMockResponse.name = name;
              return newMockResponse;
            }

            return r;
          }),
        );
        setIsSaving(false);
      })
      .finally(() => {
        setEditName(false);
      });
  };
  return (
    <>
      <div
        className="flex flex-col border border-border-color p-4 mt-4 shadow-md hover:border-blue-400 cursor-grab rounded-md min-h-[64px] active:cursor-grabbing"
        key={`${index}-${mockResponse.id}`}
        draggable
        onDragStart={() => (dragResponseRef.current = index)}
        onDragEnter={() => (dragOverResponseRef.current = index)}
        onDragEnd={onSort}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex flex-row items-center justify-between max-w-full">
          <div className="flex flex-row items-center w-full">
            <Tooltip title="Select as default response">
              <Radio
                checked={mockResponse.id === mock.selectedResponseId}
                onClick={() => {
                  onMockChange({
                    ...mock,
                    selectedResponseId: mockResponse.id,
                  });
                }}
              />
            </Tooltip>
            {selectIconByStatus(mockResponse.status)}
            <div className="flex flex-row items-center space-x-4 w-full">
              {editName ? (
                <>
                  {isSaving ? (
                    <LoadingIcon />
                  ) : (
                    <Save
                      className="text-blue-400 active:scale-110 text-lg cursor-pointer ml-4 hover:bg-border-color rounded-md"
                      onClick={handleSaveNameClicked}
                    />
                  )}
                  <Input
                    className="w-[50ch] border-none focus:ring-0"
                    defaultValue={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <AiOutlineEdit
                    onClick={() => setEditName(true)}
                    className=" text-blue-400 active:scale-110 text-lg cursor-pointer ml-4 hover:bg-border-color rounded-md"
                  />
                  <span className="truncate max-w-[50ch]">
                    {mockResponse.name}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-row items-center space-x-2">
            {onDuplicateMockResponse && (
              <Tooltip title="Duplicate mock response">
                <HiOutlineDuplicate
                  sx={{ fontSize: "15px" }}
                  onClick={() => {
                    onDuplicateMockResponse(mockResponse);
                  }}
                ></HiOutlineDuplicate>
              </Tooltip>
            )}
            {isDeleting ? (
              <LoadingIcon />
            ) : (
              <Tooltip
                title={
                  isSelected
                    ? "Cannot delete default response"
                    : "Delete the response"
                }
              >
                <IconButton>
                  <AiOutlineDelete
                    className={` text-lg cursor-pointer rounded-md active:scale-110 h-4 w-4 ${
                      isSelected
                        ? "text-gray-500 "
                        : "hover:bg-border-color text-red-400"
                    }`}
                    onClick={() => {
                      if (isSelected) return;
                      setIsDeleting(true);
                      onDeleteMockResponse(mockResponse.id).finally(() => {
                        setIsDeleting(false);
                      });
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}

            <IoIosArrowForward
              className={`active:scale-110 text-lg cursor-pointer ml-4 hover:bg-border-color rounded-md ${
                openResponseId === mockResponse.id ? "rotate-90" : ""
              }`}
              onClick={() => {
                onOpenResponse(mockResponse.id);
              }}
            />
          </div>
        </div>
        {openResponseId === mockResponse.id && (
          <MockResponseDetails
            response={mockResponse}
            handleResponseChange={(value: MockResponse) => {
              onMockResponsesChange(
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
    </>
  );
};
