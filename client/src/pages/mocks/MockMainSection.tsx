import { Radio, Tooltip } from "@mui/material";
import queryString from "query-string";
import React, { useEffect } from "react";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Mock,
  MockResponse,
  useMockResponseStore,
  useMockStore,
} from "../../stores/mockStore";
import { SnifferType, useSniffersStore } from "../../stores/sniffersStores";
import { getSnifferDomain } from "../../utils/getSnifferUrl";
import { selectIconByStatus } from "../sniffers/Invocation";
import { MockButton } from "./MockButton";
import { MockResponseDetails } from "./MockResponseDetails";
import { MockUrlInput } from "./MockUrlInput";
import { v4 as uuidv4 } from "uuid";

const MOCK_DEFAULT_STATE: Omit<Mock, "id"> = {
  method: "GET",
  url: "/",
  createdAt: "",
  isActive: true,
  snifferId: "",
  selectedResponseId: "",
  mockResponses: [],
};

export const MockMainSection: React.FC = () => {
  const location = useLocation();
  const { sniffers } = useSniffersStore();
  const { isNew, snifferId } = queryString.parse(location.search);
  const sniffer = sniffers.find((s) => s.id === snifferId);

  return (
    <>
      {sniffer && isNew && <CreateMock sniffer={sniffer} />}
      {sniffer && !isNew && <EditMock />}
    </>
  );
};

const EditMock: React.FC = () => {
  const [editedMock, setEditedMock] = React.useState<Mock>();
  const { mockId } = useParams();
  const location = useLocation();
  const { snifferId } = queryString.parse(location.search);
  const { loadMock, postMockResponse, deleteMockResponse, editMockResponse } =
    useMockResponseStore();
  const { loadingEditMock, editMock, loadingDeleteMock, deleteMock } =
    useMockStore();
  const { sniffers } = useSniffersStore();
  const sniffer = sniffers.find((s) => s.id === snifferId);
  const navigator = useNavigate();

  useEffect(() => {
    loadMock(mockId as string).then((res: Mock) => {
      setEditedMock(res);
    });
  }, []);

  const handleUrlChange = (value: string) => {
    // @ts-ignore
    setEditedMock((prev) => ({ ...prev, url: value }));
  };

  const handleMethodChange = (value: string) => {
    // @ts-ignore
    setEditedMock((prev) => ({ ...prev, method: value }));
  };

  const onClickEdit = async () => {
    if (!mockId) return;
    let newMock = {
      ...editedMock,
      isActive: true,
    };
    await editMock(snifferId as string, mockId as string, newMock);
    if (!editedMock?.mockResponses) return;
    await Promise.all(
      editedMock?.mockResponses?.map((r) => editMockResponse(r.id, { ...r })),
    );
    await loadMock(mockId as string);
  };

  const onDeleteMock = () => {
    deleteMock(snifferId as string, mockId as string).then(() => {
      navigator(`/mocks?snifferId=${snifferId}`);
    });
  };

  if (!editedMock) return null;

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
          text="Save"
          onClick={onClickEdit}
          isLoading={loadingEditMock}
        />
        <MockButton
          text="Delete"
          onClick={onDeleteMock}
          isLoading={loadingDeleteMock}
          color="error"
        />
      </div>
      <MockResponsesSection
        mockResponses={editedMock.mockResponses}
        handleMockResponsesChange={(value: MockResponse[]) => {
          // @ts-ignore
          setEditedMock((prev) => ({ ...prev, mockResponses: value }));
        }}
        selectedResponseId={editedMock.selectedResponseId}
        handleSelectedResponseIdChange={(value: string) => {
          // @ts-ignore
          setEditedMock((prev) => ({ ...prev, selectedResponseId: value }));
        }}
        handleAddMockResponse={() => {
          const index = editedMock.mockResponses.length;

          postMockResponse(snifferId as string, mockId as string, {
            name: "Response " + (index + 1),
            body: "",
            status: 200,
            headers: {},
            sequenceIndex: index,
          }).then((res: MockResponse) => {
            setEditedMock((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                selectedResponseId:
                  index === 0 ? res.id : prev.selectedResponseId,
                mockResponses: [...prev.mockResponses, res],
              };
            });
          });
        }}
        handleDeleteMockResponse={(mockResponseId: string) => {
          deleteMockResponse(mockResponseId).then((deletedId) => {
            setEditedMock((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                mockResponses: prev.mockResponses.filter(
                  (r) => r.id !== deletedId,
                ),
              };
            });
          });
        }}
      />
    </div>
  );
};

interface CreateMockProps {
  sniffer: SnifferType;
}
const CreateMock: React.FC<CreateMockProps> = ({ sniffer }) => {
  const [editedMock, setEditedMock] =
    React.useState<Omit<Mock, "id">>(MOCK_DEFAULT_STATE);
  const navigator = useNavigate();

  const { createMock, loadingNewMock } = useMockStore();

  const onClickSave = () => {
    let newMock = {
      ...editedMock,
      mockResponses: editedMock.mockResponses?.map((r, i) => ({
        ...r,
        sequenceIndex: i,
        id: uuidv4(),
      })),
      snifferId: sniffer.id as string,
      id: uuidv4(),
      isActive: true,
    };
    createMock(sniffer.id as string, newMock).then((res: any) => {
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
        mockResponses={editedMock.mockResponses}
        handleMockResponsesChange={(value: MockResponse[]) => {
          setEditedMock((prev) => ({ ...prev, mockResponses: value }));
        }}
        selectedResponseId={editedMock.selectedResponseId}
        handleSelectedResponseIdChange={(value: string) => {
          setEditedMock((prev) => ({ ...prev, selectedResponseId: value }));
        }}
        handleAddMockResponse={onAddResponse}
        handleDeleteMockResponse={onDeleteResponse}
      />
    </div>
  );
};

interface MockResponsesSectionProps {
  mockResponses: MockResponse[];
  handleMockResponsesChange: (value: MockResponse[]) => void;
  selectedResponseId: string;
  handleSelectedResponseIdChange: (value: string) => void;
  handleAddMockResponse: () => void;
  handleDeleteMockResponse: (responseId: string) => void;
}

const MockResponsesSection: React.FC<MockResponsesSectionProps> = ({
  mockResponses,
  handleMockResponsesChange,
  selectedResponseId,
  handleSelectedResponseIdChange,
  handleAddMockResponse,
  handleDeleteMockResponse,
}) => {
  const [openResponseId, setOpenResponseId] = React.useState<string>();
  const dragResponnseRef = React.useRef<number>(0);
  const dragOverResponseRef = React.useRef<number>(0);

  const handleSort = () => {
    const newResponses = mockResponses ? [...mockResponses] : [];
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
      <div
        className="flex flex-row items-center space-x-2 px-2 my-2 w-40 cursor-pointer select-none"
        onClick={handleAddMockResponse}
      >
        <AiOutlinePlus className="flex text-green-400 hover:bg-border-color rounded-md hover:cursor-pointer" />
        <span className="hover:text-green-400">Add Response</span>
      </div>
      {mockResponses.map((r, i) => (
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
                  checked={r.id === selectedResponseId}
                  onClick={() => {
                    handleSelectedResponseIdChange(r.id);
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
                  mockResponses.map((r, i) => {
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
