import { useEffect, useState } from "react";
import { InvocationSection } from "../../live-Invocations/LiveInvocationUpperBar";
import { InvocationType } from "../types";
import { useParams } from "react-router-dom";
import { useSniffersStore } from "../../../stores/sniffersStores";
import { BackendAxios } from "../../../api/backendAxios";

export const SnifferData: React.FC = () => {
  const [editedInvocation, setEditedInvocation] = useState<
    InvocationType | undefined
  >(defaultInvocation);
  const { endpointId } = useParams();
  const { invocations } = useSniffersStore();

  useEffect(() => {
    if (!endpointId) {
      return;
    }
    if (invocations.length === 0) {
      setEditedInvocation(defaultInvocation);
    } else {
      const lastInvocation = invocations[0];
      BackendAxios.get(`/invocation/${lastInvocation.id}`).then((res) => {
        if (res) {
          setEditedInvocation(res.data);
        }
      });
    }
  }, []);

  return (
    <InvocationSection
      setEditedInvocation={setEditedInvocation}
      invocation={editedInvocation}
    />
  );
};

const defaultInvocation: InvocationType = {
  id: "",
  endpointId: "",
  method: "GET",
  headers: {},
  body: "",
  snifferId: "",
  url: "",
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
