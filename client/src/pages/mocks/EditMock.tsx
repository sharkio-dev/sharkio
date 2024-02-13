import queryString from "query-string";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Mock,
  MockResponse,
  useMockResponseStore,
  useMockStore,
} from "../../stores/mockStore";
import { MockButton } from "./MockButton";
import { MockResponsesSection } from "./MockResponsesSection";
import { useSnackbar } from "../../hooks/useSnackbar";
import { SelectComponent } from "../../components/select-component/SelectComponent";
import { URLComponent } from "../live-Invocations/LiveInvocationUpperBar";

interface EditMockProps {
  mock: Mock;
  setMock: React.Dispatch<React.SetStateAction<Mock | undefined>>;
}
export const EditMock: React.FC<EditMockProps> = ({ mock, setMock }) => {
  const { mockId } = useParams();
  const location = useLocation();
  const { snifferId } = queryString.parse(location.search);
  const { postMockResponse, deleteMockResponse, editMockResponse } =
    useMockResponseStore();
  const {
    loadingEditMock,
    editMock,
    loadingDeleteMock,
    deleteMock,
    patchSelectedResponseId,
  } = useMockStore();
  const { show: showSnackbar, component: snackBar } = useSnackbar();

  const navigator = useNavigate();

  const handleUrlChange = (value: string) => {
    setMock((prev) => {
      if (!prev) return prev;
      return { ...prev, url: value };
    });
  };

  const handleSelectionMethodChanged = (selectionMethod: string) => {
    setMock((prev) => {
      if (!prev) return prev;
      return { ...prev, responseSelectionMethod: selectionMethod };
    });
  };

  const handleMethodChange = (value: string) => {
    setMock((prev) => {
      if (!prev) return prev;
      return { ...prev, method: value };
    });
  };

  const onClickEdit = async () => {
    if (!mockId) return;
    await editMock(snifferId as string, mockId as string, mock)
      .then(() => {
        showSnackbar("Mock saved successfully", "success");
      })
      .catch(() => {
        showSnackbar("Failed to save mock", "error");
      });
    await patchSelectedResponseId(
      mockId as string,
      mock.selectedResponseId,
    ).catch(() => {
      showSnackbar("Failed to update default response", "error");
    });
    if (!mock?.mockResponses) return;
    await Promise.all(
      mock?.mockResponses?.map((r, i) =>
        editMockResponse(r.id, { ...r, sequenceIndex: i + 1 }),
      ),
    ).catch(() => {
      showSnackbar("Failed to save mock responses", "error");
    });
  };

  const onDeleteMock = (snifferId: string, mockId: string) => {
    deleteMock(snifferId as string, mockId as string)
      .then(() => {
        navigator(`/mocks?snifferId=${snifferId}`);
      })
      .catch(() => {
        showSnackbar("Failed to delete mock", "error");
      });
  };

  const onMockResponseChange = (value: MockResponse[]) => {
    setMock((prev) => {
      if (!prev) return prev;
      return { ...prev, mockResponses: value };
    });
  };

  const onAddMockResponse = () => {
    const index = mock.mockResponses.length;

    return postMockResponse(snifferId as string, mockId as string, {
      name: "Response " + (index + 1),
      body: "",
      status: 200,
      headers: {},
      sequenceIndex: index,
    }).then((res: MockResponse) => {
      setMock((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          selectedResponseId: index === 0 ? res.id : prev.selectedResponseId,
          mockResponses: [...prev.mockResponses, res],
        };
      });
    });
  };

  const onDuplicateMockResponse = (mockToDuplicate: MockResponse) => {
    const index = mock.mockResponses.length;

    return postMockResponse(snifferId as string, mockId as string, {
      name: `${mockToDuplicate.name} copy`,
      body: mockToDuplicate.body,
      status: mockToDuplicate.status,
      headers: mockToDuplicate.headers,
      sequenceIndex: index,
    }).then((res: MockResponse) => {
      setMock((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          mockResponses: [...prev.mockResponses, res],
        };
      });
    });
  };

  const onDeleteMockResponse = (mockResponseId: string) => {
    return deleteMockResponse(mockResponseId).then((deletedId) => {
      setMock((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          mockResponses: prev.mockResponses.filter((r) => r.id !== deletedId),
        };
      });
    });
  };

  return (
    <>
      <div className="flex flex-col h-full overflow-y-auto">
        {snackBar}
        <div className="flex flex-row items-center space-x-4 border-b border-border-color pb-4">
          <URLComponent
            method={mock.method}
            url={mock.url}
            snifferId={mock.snifferId}
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
              value={mock.responseSelectionMethod}
              setValue={(value) => {
                handleSelectionMethodChanged(value);
              }}
            />
          </div>
          <MockButton
            text="Save"
            onClick={onClickEdit}
            isLoading={loadingEditMock}
          />
          <MockButton
            text="Delete"
            onClick={() => onDeleteMock(snifferId as string, mockId as string)}
            isLoading={loadingDeleteMock}
            color="error"
          />
        </div>
        <MockResponsesSection
          mock={mock}
          handleMockChange={setMock}
          handleMockResponsesChange={onMockResponseChange}
          handleAddMockResponse={onAddMockResponse}
          handleDeleteMockResponse={onDeleteMockResponse}
          handleDuplicateMockResponse={onDuplicateMockResponse}
        />
      </div>
    </>
  );
};
