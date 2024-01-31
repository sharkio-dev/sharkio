import { Invocation } from "../sniffers/Invocation";
import { useSniffersStore } from "../../stores/sniffersStores";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { getSnifferDomain } from "../../utils/getSnifferUrl";
import LiveInvocations from "./live-invocations-side-bar/LiveInvocationsSideBar";
import { useState, useEffect } from "react";

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
  const { invocations, loadingInvocations, loadSniffers } = useSniffersStore();
  const [proxies, setProxies] = useState<string[]>([]);
  // invocations[0].id;
  console.log({ invocations });

  useEffect(() => {
    const getProxiesNames = async () => {
      const sniffers = await loadSniffers();
      const proxiesNames = sniffers.map((snifferObj) => snifferObj.name);
      setProxies(proxiesNames);
    };

    getProxiesNames();
  }, []);

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
                url={`${getSnifferDomain(invocations[i].headers.host)} ${
                  invocations[i].url
                }`}
              />
            );
          })
        )}
      </div>
    </>
  );
};
