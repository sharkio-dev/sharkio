import { InvocationType } from "../sniffers/types";
import { Invocation } from "../sniffers/Invocation";
import { LuRefreshCcw } from "react-icons/lu";
import { useSniffersStore } from "../../stores/sniffersStores";
import { LoadingIcon } from "../sniffers/LoadingIcon";

type InvocationsSearchBarProps = {
  activeInvocation?: InvocationType;
  setActiveInvocation: (invocationId: string) => void;
  title: string;
  refresh?: () => void;
};
export const InvocationsSearchBar = ({
  activeInvocation,
  setActiveInvocation,
  title,
  refresh,
}: InvocationsSearchBarProps) => {
  const { invocations, loadingInvocations } = useSniffersStore();
  return (
    <>
      <div className="flex flex-row justify-between items-center text-center mb-4">
        <div className="text-xl font-bold font-mono ">{title}</div>
        <div className="flex flex-row-reverse items-center space-x-4 w-1/2">
          {refresh && (
            <LuRefreshCcw
            className="flex text-gray-500 text-xl cursor-pointer ml-4"
            onClick={refresh}
            />
            )}
        </div>
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
                isSelected={invocation.id === activeInvocation?.id}
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
