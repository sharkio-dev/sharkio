import { Radio, Tooltip } from "@mui/material";
import queryString from "query-string";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Mock,
  MockResponse,
  useMockResponseStore,
  useMockStore,
} from "../../stores/mockStore";
import { useSniffersStore } from "../../stores/sniffersStores";
import { getSnifferDomain } from "../../utils/getSnifferUrl";
import { selectIconByStatus } from "../sniffers/Invocation";
import { MockButton } from "./MockButton";
import { MockResponseDetails } from "./MockResponseDetails";
import { MockUrlInput } from "./MockUrlInput";

const MOCK_DEFAULT_STATE: Mock = {
  id: "",
  method: "GET",
  url: "/",
  createdAt: "",
  isActive: true,
  snifferId: "",
  selectedResponseId: "1",
  mockResponses: [],
};

export const MockMainSection: React.FC = () => {
  const {
    mocks,
    createMock,
    loadingNewMock,
    loadingEditMock,
    editMock,
    deleteMock,
    loadingDeleteMock,
    responsedOrder,
  } = useMockStore();
  const { mockId } = useParams();
  const location = useLocation();
  const { sniffers } = useSniffersStore();
  const { isNew, snifferId } = queryString.parse(location.search);
  const navigator = useNavigate();
  const [editedMock, setEditedMock] = React.useState<Mock>(MOCK_DEFAULT_STATE);
  const sniffer = sniffers.find((s) => s.id === snifferId);
  const [openResponseId, setOpenResponseId] = React.useState<string>();
  const dragResponnseRef = React.useRef<number>(0);
  const dragOverResponseRef = React.useRef<number>(0);
  const {
    mock,
    mockResponses,
    editMockResponse,
    deleteMockResponse,
    postMockResponse,
    resetMock,
    loadMock,
    loadingMock,
    loadingMockResponses,
  } = useMockResponseStore();

  useEffect(() => {
    if (mockId) {
      loadMock(snifferId as string, mockId as string);
    }
    if (isNew) {
      setEditedMock(MOCK_DEFAULT_STATE);
    }
  }, [mockId, isNew, mocks]);

  const onClickSave = () => {
    let newMock = {
      ...editedMock,
      isActive: true,
    };
    createMock(snifferId as string, newMock).then((res: any) => {
      navigator(`/mocks/${res?.id}?snifferId=${snifferId}`);
    });
  };

  const onClickEdit = () => {
    if (!mockId) return;
    let newMock = {
      ...editedMock,
      isActive: true,
    };
    editMock(snifferId as string, mockId as string, newMock);
  };

  const handleUrlChange = (value: string) => {
    setEditedMock((prev) => ({ ...prev, url: value }));
  };

  const handleMethodChange = (value: string) => {
    setEditedMock((prev) => ({ ...prev, method: value }));
  };

  const onAddResponse = () => {
    let index = mockResponses ? mockResponses.length : 0;
    const newResponse = {
      name: `Response ${index} (200)`,
      body: "",
      status: 200,
      headers: {},
    };
    postMockResponse(snifferId as string, mockId as string, newResponse);
  };

  const onDeleteMock = () => {
    deleteMock(snifferId as string, mockId as string).then(() => {
      navigator(`/mocks?snifferId=${snifferId}`);
    });
  };

  const handleSort = () => {
    const newResponses = mockResponses ? [...mockResponses] : [];
    const draggedResponse = newResponses[dragResponnseRef.current];
    newResponses.splice(dragResponnseRef.current, 1);
    newResponses.splice(dragOverResponseRef.current, 0, draggedResponse);
    // TODO: implement this
    responsedOrder();
    setEditedMock((prev) => ({ ...prev, mockResponses: newResponses }));
  };

  const setDefaultResponse = (responseId: string) => {
    setEditedMock((prev) => ({ ...prev, selectedResponseId: responseId }));
  };

  const onDeleteMockResponse = (responseId: string) => {
    deleteMockResponse(snifferId as string, mockId as string, responseId);
  };

  const setOpenedResponse = (responseId: string) => {
    if (openResponseId === responseId) {
      setOpenResponseId(undefined);
      return;
    }
    setOpenResponseId(responseId);
  };

  const onResponseChange = (value: MockResponse) => {
    editMockResponse(snifferId as string, mockId as string, value);
    setEditedMock((prev) => ({
      ...prev,
      mockResponses: prev.mockResponses
        ? prev.mockResponses.map((r, i) => {
            if (r.id === value.id) {
              return value;
            }
            return r;
          })
        : [],
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
        {isNew && (
          <MockButton
            text="Create"
            onClick={onClickSave}
            isLoading={loadingNewMock}
          />
        )}
        {!isNew && (
          <MockButton
            text="Save"
            onClick={onClickEdit}
            isLoading={loadingEditMock}
          />
        )}
        {!isNew && (
          <MockButton
            text="Delete"
            onClick={onDeleteMock}
            isLoading={loadingDeleteMock}
            color="error"
          />
        )}
      </div>
      <div className="flex-col">
        <div
          className="flex flex-row items-center space-x-2 px-2 my-2 w-40 cursor-pointer select-none"
          onClick={onAddResponse}
        >
          <AiOutlinePlus className="flex text-green-400 hover:bg-border-color rounded-md hover:cursor-pointer" />
          <span className="hover:text-green-400">Add Response</span>
        </div>
        {mockResponses?.map((r, i) => (
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
                    checked={r.id === editedMock.selectedResponseId}
                    onClick={() => setDefaultResponse(r.id)}
                  />
                </Tooltip>
                {selectIconByStatus(r.status)}
                <div className="flex flex-row items-center space-x-2 px-2">
                  <div className="flex parent-hover:hover:opacity-100 opacity-0">
                    <AiOutlineEdit className="text-gray-400 active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md" />
                  </div>
                  <span>{r.name}</span>
                </div>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <AiOutlineDelete
                  className=" text-red-400 active:scale-110 text-lg cursor-pointer ml-4 hover:bg-border-color rounded-md"
                  onClick={() => {
                    onDeleteMockResponse(r.id);
                  }}
                />
                <IoIosArrowForward
                  className={`active:scale-110 text-lg cursor-pointer ml-4 hover:bg-border-color rounded-md ${
                    openResponseId === r.id ? "rotate-90" : ""
                  }`}
                  onClick={() => {
                    setOpenedResponse(r.id);
                  }}
                />
              </div>
            </div>
            {openResponseId === r.id && (
              <MockResponseDetails
                response={r}
                handleResponseChange={onResponseChange}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
