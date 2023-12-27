import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Mock, MockResponse, useMockStore } from "../../stores/mockStore";
import queryString from "query-string";
import { useSniffersStore } from "../../stores/sniffersStores";
import { getSnifferDomain } from "../../utils/getSnifferUrl";
import { SelectComponent } from "../../components/select-component/SelectComponent";
import { AiOutlinePlus } from "react-icons/ai";
import { MockButton } from "./MockButton";
import { MockUrlInput } from "./MockUrlInput";
import { MockResponseDetails } from "./MockResponseDetails";

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

  const getSelectedResponse = (mock: Mock) => {
    return mock.responses.find((r) => r.id === mock.selectedResponseId);
  };

  const selectedResponse = getSelectedResponse(editedMock);

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
      selectedResponse: newResponse.id,
    }));
  };

  return (
    <>
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
      <div className="flex flex-row items-center">
        <AiOutlinePlus
          className="text-blue-500 h-8 w-8 p-1 mr-4 cursor-pointer active:scale-95"
          onClick={onAddResponse}
        />
        <SelectComponent
          options={
            editedMock?.responses.map((r) => ({
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
      />
    </>
  );
};
