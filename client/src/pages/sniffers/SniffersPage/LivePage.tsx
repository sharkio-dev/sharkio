import { useCallback, useEffect, useState } from "react";
import { InvocationType } from "../types";
import { InvocationsBottomBar } from "../InvocationsBottomBar";
import { LoadingIcon } from "../LoadingIcon";
import { getLiveInvocations } from "../../../api/api";
import { InvocationUpperBar } from ".././InvocationUpperBar";
import { useNavigate, useParams } from "react-router-dom";

export const LivePage = () => {
  const [invocations, setInvocations] = useState<InvocationType[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const { invocationId } = useParams();
  const navigator = useNavigate();

  const invocation = invocations.find((i) => i.id === invocationId);

  const loadInvocations = async () => {
    setLoadingRequests(true);
    return getLiveInvocations()
      .then((res) => {
        const invocations = res.data;
        setInvocations(invocations);
        if (invocations.length > 0 && !invocationId) {
          navigator(`/live/invocations/${invocations[0].id}`, {
            replace: true,
          });
        }
        return invocations;
      })
      .finally(() => {
        setLoadingRequests(false);
      });
  };

  useEffect(() => {
    loadInvocations();
    const int = setInterval(() => {
      loadInvocations();
    }, 60000);

    return () => {
      clearInterval(int);
    };
  }, []);

  const onInvocationClick = useCallback(
    (id: string) => {
      navigator(`/live/invocations/${id}`);
    },
    [invocationId],
  );

  return (
    <>
      <div className={`flex flex-col w-full`}>
        <div className="flex flex-col p-4 px-4 border-b border-border-color h-2/3 max-h-[calc(67vh-56px)] overflow-y-auto">
          <InvocationUpperBar
            activeInvocation={invocation}
            onExecuteRequest={() => loadInvocations()}
          />
        </div>
        <div className="flex flex-col p-2 px-4 h-1/3 max-h-[calc(33vh-16px)] overflow-y-auto overflow-x-auto">
          {invocations &&
            (loadingRequests ? (
              <div className="flex flex-1 justify-center items-center">
                <LoadingIcon />
              </div>
            ) : (
              <InvocationsBottomBar
                title={"Live Invocations"}
                invocations={invocations}
                activeInvocation={invocation}
                setActiveInvocation={onInvocationClick}
                refresh={() => loadInvocations()}
              />
            ))}
        </div>
      </div>
    </>
  );
};
