import { Invocation } from "../sniffers/Invocation";
import { LuRefreshCcw } from "react-icons/lu";
import { useSniffersStore } from "../../stores/sniffersStores";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import LiveInvocations from "./live-invocations-side-bar/LiveInvocationsSideBar";

type InvocationsSearchBarProps = {
  invocationId?: string;
  setActiveInvocation: (invocationId: string) => void;
  title: string;
};
export const InvocationsSearchBar = ({
  invocationId,
  setActiveInvocation,
  title,
}: InvocationsSearchBarProps) => {
  const { invocations, loadingInvocations } = useSniffersStore();
  return (
    <>
      <div className="text-xl font-bold font-mono mb-4">{title}</div>
      <div className="flex flex-row justify-between items-center text-center mb-4">
        <LiveInvocations />
      </div>

      <div className="flex flex-col w-full overflow-y-auto">
        {loadingInvocations ? (
          <div className="flex h-[25vh] w-full justify-center items-center">
            <LoadingIcon />
          </div>
        ) : (
          invocations.map((invocation, i) => {
            return (
              <Invocation
                method={invocation.method}
                isSelected={invocation.id === invocationId}
                onClick={() => setActiveInvocation(invocation.id)}
                key={i}
                date={new Date(invocation.createdAt).toLocaleString()}
                status={invocation?.response?.status}
                url={invocation.url}
              />
            );
          })
        )}
      </div>
    </>
  );
};
