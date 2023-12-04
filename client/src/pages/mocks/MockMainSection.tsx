import { Button, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BodySection } from "../test-suites/BodySection";
import { HeaderSection } from "../test-suites/HeaderSection";
import { useMockStore } from "../../stores/mockStore";
import queryString from "query-string";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { SelectMethodDropDown } from "./SelectMethodDropDown";
import { BodyHeaderStatusToggle } from "./BodyHeaderStatusToggle";
import StatusCodeSelector from "../test-suites/StatusCodeSelector";

export const MockMainSection = () => {
  const [section, setSection] = React.useState<"Status" | "Body" | "Headers">(
    "Body",
  );
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
  const { isNew, snifferId } = queryString.parse(location.search);
  const navigator = useNavigate();
  const [editedMock, setEditedMock] = React.useState({
    method: "GET",
    url: "",
    status: "200",
    headers: [{ name: "", value: "" }],
    body: "",
    isActive: true,
  });

  useEffect(() => {
    if (mockId) {
      const mock = mocks.find((mock) => mock.id === mockId);
      if (!mock) return;
      setEditedMock({
        method: mock.method,
        url: mock.url,
        status: mock.status,
        headers: Object.entries(mock.headers || {}).map(([key, value]) => ({
          name: key,
          value,
        })),
        body: mock.body,
        isActive: mock.isActive,
      });
    }
    if (isNew) {
      setEditedMock({
        method: "GET",
        url: "",
        status: "200",
        headers: [],
        body: "",
        isActive: true,
      });
    }
  }, [mockId, isNew]);

  const onClickSave = () => {
    let newMock = {
      ...editedMock,
      headers: editedMock.headers.reduce(
        (acc: object, header: { name: string; value: string }) => {
          if (!header.name) return acc;
          return { ...acc, [header.name]: header.value };
        },
        {},
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
        {},
      ),
      isActive: true,
    };
    editMock(snifferId as string, mockId as string, newMock);
  };

  return (
    <>
      <div className="flex flex-row items-center space-x-4">
        <div className="flex flex-row items-center w-40">
          <SelectMethodDropDown
            value={editedMock.method || ""}
            onChange={(value: string) => {
              setEditedMock((prev) => ({ ...prev, method: value }));
            }}
          />
        </div>
        <TextField
          value={editedMock.url || ""}
          onChange={(e: any) => {
            setEditedMock((prev) => ({ ...prev, url: e.target.value }));
          }}
          variant="outlined"
          size="small"
          style={{ width: "100%" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={isNew ? onClickSave : onClickEdit}
        >
          {loadingNewMock || loadingEditMock ? (
            <LoadingIcon />
          ) : isNew ? (
            "Create"
          ) : (
            "Save"
          )}
        </Button>
        {!isNew && (
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              deleteMock(snifferId as string, mockId as string).then(() => {
                navigator(`/mocks?snifferId=${snifferId}`);
              });
            }}
          >
            {loadingDeleteMock ? <LoadingIcon /> : "Delete"}
          </Button>
        )}
      </div>
      <div className="flex flex-col h-full p-2 rounded-md overflow-y-auto">
        <BodyHeaderStatusToggle
          value={section}
          setValue={(value: string) => setSection(value as any)}
        />
        {section === "Status" && (
          <StatusCodeSelector
            value={editedMock.status || ""}
            setValue={(value) => {
              setEditedMock((prev) => ({ ...prev, status: value }));
            }}
          />
        )}
        {section === "Body" && (
          <BodySection
            body={editedMock.body || ""}
            onBodyChange={(value: any) => {
              setEditedMock((prev) => ({ ...prev, body: value }));
            }}
          />
        )}
        {section === "Headers" && (
          <HeaderSection
            headers={editedMock.headers || []}
            setHeaders={(index, value, key) => {
              setEditedMock((prev) => {
                const headers = [...prev.headers];
                headers[index] = { name: key, value };
                return { ...prev, headers };
              });
            }}
            addHeader={() => {
              setEditedMock((prev) => ({
                ...prev,
                headers: [...prev.headers, { name: "", value: "" }],
              }));
            }}
            deleteHeader={(index: number) => {
              setEditedMock((prev) => {
                const headers = [...prev.headers];

                return {
                  ...prev,
                  headers: headers.filter((_, i) => i !== index),
                };
              });
            }}
          />
        )}
      </div>
    </>
  );
};
