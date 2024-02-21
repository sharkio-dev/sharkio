import { useEffect, useState } from "react";
import { InvocationSection } from "../../live-Invocations/LiveInvocationUpperBar";
import { InvocationType } from "../types";
import { useParams } from "react-router-dom";
import { useSniffersStore } from "../../../stores/sniffersStores";
import { LoadingIcon } from "../LoadingIcon";

export const SnifferData: React.FC = () => {
  const [editedInvocation, setEditedInvocation] = useState<
    InvocationType | undefined
  >();
  const { endpointId } = useParams();
  const { endpoints } = useSniffersStore();

  useEffect(() => {
    if (!endpointId) {
      return;
    }
    const endpoint = endpoints.find((e) => e.id === endpointId);
    if (endpoint) {
      setEditedInvocation(endpoint as InvocationType);
    }
  }, [endpointId, endpoints]);

  if (!editedInvocation) {
    return null;
  }

  return (
    <>
      <InvocationSection
        isDisabled={false}
        setEditedInvocation={setEditedInvocation}
        invocation={editedInvocation}
      />
    </>
  );
};

const defaultInvocation: InvocationType = {
  id: "",
  endpointId: "",
  method: "GET",
  headers: {},
  body: "",
  snifferId: "",
  url: "/",
  response: {
    status: 200,
    body: "",
    headers: {},
  },
  createdAt: new Date().toISOString(),
};
export const CreateInvocation: React.FC = () => {
  const [invocation, setInvocation] = useState<InvocationType | undefined>(
    defaultInvocation,
  );
  return (
    <InvocationSection
      isDisabled={false}
      invocation={invocation}
      setEditedInvocation={(v) => {
        setInvocation(v);
      }}
    />
  );
};
