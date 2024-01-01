import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSniffersStore } from "../../../stores/sniffersStores";
import { InvocationUpperBar } from "../InvocationUpperBar";
import { EndpointType, InvocationType } from "../types";

export const SnifferData: React.FC = () => {
  const { endpointId } = useParams();
  const { endpoints } = useSniffersStore();
  const [editedInvocation, setEditedInvocation] = useState<
    EndpointType | undefined
  >(undefined);

  useEffect(() => {
    const invocation = endpoints?.find((e) => e.id === endpointId);
    setEditedInvocation(invocation);
  }, [endpointId]);

  return (
    <>
      <div className={`flex flex-col w-full`}>
        <div className="flex flex-col p-4 px-4 h-2/3 max-h-[calc(67vh-56px)] overflow-y-auto">
          <InvocationUpperBar
            invocation={editedInvocation}
            setEditedInvocation={setEditedInvocation}
            showResponseTab={false}
          />
        </div>
      </div>
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
  url: "",
  response: {
    status: 200,
    body: "",
    headers: {},
  },
  createdAt: new Date().toISOString(),
};
export const CreateInvocation: React.FC = () => {
  const [invocation, setInvocation] = useState<EndpointType | undefined>(
    defaultInvocation,
  );
  return (
    <div className={`flex flex-col w-full`}>
      <div className="flex flex-col p-4 px-4 h-[100vh-96px] overflow-y-auto">
        <InvocationUpperBar
          isDisabled={false}
          invocation={invocation}
          setEditedInvocation={(v) => {
            setInvocation(v);
          }}
          showResponseTab={false}
        />
      </div>
    </div>
  );
};
