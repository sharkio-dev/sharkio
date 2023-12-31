import queryString from "query-string";
import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Mock, useMockResponseStore } from "../../stores/mockStore";
import { useSniffersStore } from "../../stores/sniffersStores";
import { v4 as uuidv4 } from "uuid";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { CreateMock } from "./CreateMock";
import { EditMock } from "./EditMock";

export const getMockDefaultState = (snifferId: string): Mock => {
  const responseId = uuidv4();
  return {
    id: uuidv4(),
    method: "GET",
    url: "/",
    createdAt: "",
    isActive: true,
    snifferId: snifferId,
    selectedResponseId: responseId,
    responseSelectionMethod: "default",
    mockResponses: [
      {
        id: responseId,
        name: "Response 1",
        body: "",
        status: 200,
        headers: {},
        sequenceIndex: 0,
      },
    ],
  };
};

export const MockMainSection: React.FC = () => {
  const location = useLocation();
  const { sniffers } = useSniffersStore();
  const { isNew, snifferId } = queryString.parse(location.search);
  const sniffer = sniffers.find((s) => s.id === snifferId);
  const [editedMock, setEditedMock] = React.useState<Mock>();
  const { mockId } = useParams();
  const { loadMock, loadingMock } = useMockResponseStore();

  useEffect(() => {
    if (isNew || !mockId) return;
    loadMock(mockId as string).then((res: Mock) => {
      setEditedMock(res);
    });
  }, [isNew, mockId]);

  return (
    <>
      {loadingMock && (
        <div className="flex h-[calc(100vh-96px)] w-full justify-center items-center">
          <LoadingIcon />
        </div>
      )}
      {sniffer && isNew && <CreateMock sniffer={sniffer} />}
      {sniffer && !isNew && editedMock && !loadingMock && (
        <EditMock mock={editedMock as Mock} setMock={setEditedMock} />
      )}
    </>
  );
};
