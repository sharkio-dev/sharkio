import { Button, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BodySection } from "../test-suites/BodySection";
import { HeaderSection } from "../test-suites/HeaderSection";
import { Mock, MockResponse, useMockStore } from "../../stores/mockStore";
import queryString from "query-string";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { SelectMethodDropDown } from "./SelectMethodDropDown";
import { BodyHeaderToggle } from "./BodyHeaderStatusToggle";
import StatusCodeSelector from "../test-suites/StatusCodeSelector";
import { useSniffersStore } from "../../stores/sniffersStores";
import { getSnifferDomain } from "../../utils/getSnifferUrl";
import { SelectComponent } from "../../components/select-component/SelectComponent";
import { AiOutlinePlus } from "react-icons/ai";

const MOCK_DEFAULT_STATE = {
  id: "",
  method: "GET",
  url: "/",
  createdAt: "",
  isActive: true,
  snifferId: "",
  selectedResponse: "1",
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
    return mock.responses.find((r) => r.id === mock.selectedResponse);
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
      headers: editedMock.headers.reduce(
        (acc: object, header: { name: string; value: string }) => {
          if (!header.name) return acc;
          return { ...acc, [header.name]: header.value };
        },
        {}
      ),
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
      headers: editedMock.headers.reduce(
        (acc: object, header: { name: string; value: string }) => {
          if (!header.name) return acc;
          return { ...acc, [header.name]: header.value };
        },
        {}
      ),
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
          value={editedMock.selectedResponse}
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

interface MockResponseDetailsProps {
  response: MockResponse;
  hadnleResponseChange: (value: MockResponse) => void;
}

const MockResponseDetails: React.FC<MockResponseDetailsProps> = ({
  response,
  hadnleResponseChange,
}) => {
  const [section, setSection] = React.useState<"Status" | "Body" | "Headers">(
    "Body"
  );

  return (
    <div className="flex flex-col h-full py-2 rounded-md overflow-y-auto">
      <BodyHeaderToggle
        value={section}
        setValue={(value: string) => setSection(value as any)}
      />
      {section === "Body" && (
        <div className="flex flex-col items-center space-y-4">
          <StatusCodeSelector
            value={response.status.toString() || ""}
            setValue={(value) => {
              hadnleResponseChange({ ...response, status: +value });
            }}
          />
          <BodySection
            body={response.body || ""}
            onBodyChange={(value: any) => {
              hadnleResponseChange({ ...response, body: value });
            }}
          />
        </div>
      )}

      {section === "Headers" && (
        <HeaderSection
          headers={response.headers || {}}
          handleHeadersChange={(headers: object) => {
            hadnleResponseChange({ ...response, headers });
          }}
        />
      )}
    </div>
  );
};

interface MockUrlInputProps {
  url?: string;
  handleUrlChange: (value: string) => void;
  method?: string;
  handleMethodChange: (value: string) => void;
  snifferDomain?: string;
}

const MockUrlInput: React.FC<MockUrlInputProps> = ({
  url,
  handleUrlChange,
  method,
  handleMethodChange,
  snifferDomain,
}) => {
  return (
    <>
      <div className="flex flex-row items-center w-40">
        <SelectMethodDropDown
          value={method || ""}
          onChange={(e: any) => {
            handleMethodChange(e.target.value);
          }}
        />
      </div>
      <div className="flex flex-row items-center w-[550px]">
        <TextField
          disabled={true}
          value={snifferDomain}
          variant="outlined"
          size="small"
          style={{ width: "100%" }}
        />
      </div>
      <TextField
        value={url || ""}
        onChange={(e) => {
          handleUrlChange(e.target.value);
        }}
        variant="outlined"
        size="small"
        style={{ width: "100%" }}
      />
    </>
  );
};

interface SaveMockButtonProps {
  onClick: () => void;
  text: string;
  isLoading?: boolean;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
}

const MockButton: React.FC<SaveMockButtonProps> = ({
  text,
  onClick,
  isLoading = false,
  color = "primary",
}) => {
  return (
    <Button variant="outlined" color={color} onClick={onClick}>
      {isLoading ? <LoadingIcon /> : text}
    </Button>
  );
};
