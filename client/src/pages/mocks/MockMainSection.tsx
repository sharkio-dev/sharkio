import { Radio, Tooltip } from "@mui/material";
import queryString from "query-string";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Mock, MockResponse, useMockStore } from "../../stores/mockStore";
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
  responses: [
    {
      id: "1",
      name: "Response 1 (200)",
      body: "",
      status: 200,
      headers: {},
    },
  ],
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
  } = useMockStore();
  const { mockId } = useParams();
  const location = useLocation();
  const { sniffers } = useSniffersStore();
  const { isNew, snifferId } = queryString.parse(location.search);
  const navigator = useNavigate();
  const [editedMock, setEditedMock] = React.useState(MOCK_DEFAULT_STATE);
  const sniffer = sniffers.find((s) => s.id === snifferId);
  const [openResponseId, setOpenResponseId] = React.useState<string>();
  const dragResponnseRef = React.useRef<number>(0);
  const dragOverResponseRef = React.useRef<number>(0);

  useEffect(() => {
    if (mockId) {
      const mock = mocks.find((mock) => mock.id === mockId);
      if (!mock) return;
      setEditedMock(mock);
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
    const newResponse = {
      id: Math.random().toString(),
      name: `Response ${editedMock.responses.length + 1} (200)`,
      body: "",
      status: 200,
      headers: {},
    };
    setEditedMock((prev) => ({
      ...prev,
      responses: [...prev.responses, newResponse],
      selectedResponseId: newResponse.id,
    }));
  };

  const handleSort = () => {
    const newResponses = [...editedMock.responses];
    const draggedResponse = newResponses[dragResponnseRef.current];
    newResponses.splice(dragResponnseRef.current, 1);
    newResponses.splice(dragOverResponseRef.current, 0, draggedResponse);
    setEditedMock((prev) => ({ ...prev, responses: newResponses }));
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
            onClick={() => {
              deleteMock(snifferId as string, mockId as string).then(() => {
                navigator(`/mocks?snifferId=${snifferId}`);
              });
            }}
            isLoading={loadingDeleteMock}
            color="error"
          />
        )}
      </div>
      <div className="flex-col">
        <div
          className="flex flex-row items-center space-x-2 px-2 my-2 w-40 cursor-pointer"
          onClick={onAddResponse}
        >
          <AiOutlinePlus className="flex text-green-400 hover:bg-border-color rounded-md hover:cursor-pointer" />
          <span className="hover:text-green-400">Add Response</span>
        </div>
        {editedMock.responses?.map((r, i) => (
          <div
            className="flex flex-col border border-border-color p-4 mt-4 shadow-md hover:border-blue-400 cursor-grab rounded-md min-h-[64px] active:cursor-grabbing"
            key={i}
            draggable
            onDragStart={(e) => (dragResponnseRef.current = i)}
            onDragEnter={(e) => (dragOverResponseRef.current = i)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center space-x-2">
                <Tooltip title="Select as default response">
                  <Radio
                    checked={r.id === editedMock.selectedResponseId}
                    onClick={() => {
                      setEditedMock((prev) => ({
                        ...prev,
                        selectedResponseId: r.id,
                      }));
                    }}
                  />
                </Tooltip>
                {selectIconByStatus(r.status)}
                <div className="flex flex-row items-center space-x-2 first:opacity-0 hover:first:opacity-100">
                  <AiOutlineEdit className="text-gray-400 active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md" />
                  <span>{r.name}</span>
                </div>
              </div>
              <div className="flex flex-row items-center space-x-2">
                <AiOutlineDelete
                  className=" text-red-400 active:scale-110 text-lg cursor-pointer ml-4 hover:bg-border-color rounded-md"
                  // onClick={() => invokeKey(row.id)}
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
                  setEditedMock((prev) => ({
                    ...prev,
                    responses: prev.responses.map((r, i) => {
                      if (r.id === value.id) {
                        let name = `Response ${i} (${value.status})`;
                        return { ...value, name };
                      }
                      return r;
                    }),
                  }));
                }}
              />
            )}
          </div>
        ))}
      </div>
      {/* <div className="flex flex-row items-center">
        <AiOutlinePlus
          className="text-blue-500 h-8 w-8 p-1 mr-4 cursor-pointer active:scale-95"
          onClick={onAddResponse}
        />
        <SelectComponent
          options={
            editedMock?.mockResponses.map((r) => ({
              value: r.id,
              label: r.name,
            })) || []
          }
          title="Responses"
          value={editedMock.selectedResponseId}
          disabled={false}
          setValue={(value: string) => {
            setEditedMock((prev) => ({ ...prev, selectedResponse: value }));
          }}
        />
      </div>
      <MockResponseDetails
        response={selectedResponse as MockResponse}
        hadnleResponseChange={(value: MockResponse) => {
          setEditedMock((prev) => ({
            ...prev,
            responses: prev.responses.map((r, i) => {
              if (r.id === value.id) {
                let name = `Response ${i} (${value.status})`;
                return { ...value, name };
              }
              return r;
            }),
          }));
        }}
      /> */}
    </div>
  );
};
