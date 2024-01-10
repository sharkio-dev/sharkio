import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "../../constants/routes";
import { InvocationUpperBar } from "./LiveInvocationUpperBar";
import { InvocationsSearchBar } from "./LiveInvocationsBottomBar";
import { InvocationType } from "../sniffers/types";
import { BackendAxios } from "../../api/backendAxios";

export const LivePage = () => {
  return <LivePageMainSection />;
};

const LivePageMainSection = () => {
  const navigator = useNavigate();
  const { invocationId } = useParams();

  const onInvocationClick = useCallback(
    (id: string) => {
      const currentSearchParams = new URLSearchParams(window.location.search);
      navigator(
        `${routes.LIVE_INVOCATIONS}/${id}?${currentSearchParams.toString()}`,
      );
    },
    [invocationId],
  );
  return (
    <div className={`flex flex-col w-full h-full p-4`}>
      <InvocationsSearchBar
        invocationId={invocationId}
        title={"Requests"}
        setActiveInvocation={onInvocationClick}
      />
    </div>
  );
};

export const InvocationScreen = () => {
  const [invocation, setInvocation] = useState<InvocationType>();
  const { invocationId } = useParams();

  useEffect(() => {
    if (!invocationId) {
      setInvocation(undefined);
      return;
    }
    BackendAxios.get(`/invocation/${invocationId}`).then((res) => {
      if (res) {
        setInvocation(res.data);
      }
    });
  }, [invocationId]);

  return (
    <div className="flex flex-col p-4 px-4 border-b border-border-color h-full">
      <InvocationUpperBar
        invocation={invocation}
        setEditedInvocation={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
};
