import { Invocation } from "../sniffers/Invocation";
import { useSniffersStore } from "../../stores/sniffersStores";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { getSnifferDomain } from "../../utils/getSnifferUrl";
import LiveInvocations from "./live-invocations-side-bar/LiveInvocationsSideBar";
import { useSearchParams } from "react-router-dom";
import { ImportToFlowDialog } from "./ImportToFlowDialog";

import React from "react";

type InvocationsSearchBarProps = {
  setActiveInvocation: (invocationId: string) => void;
  title: string;
};
export const InvocationsSearchBar = ({
  setActiveInvocation,
  title,
}: InvocationsSearchBarProps) => {
  const hostname = document.location.origin;
  const [searchParams] = useSearchParams();
  const {
    invocations,
    loadingInvocations,
    getSnifferById,
    loadLiveInvocations,
  } = useSniffersStore();

  const invocationLink = (invocationId: string) => {
    return `${hostname}/live-invocations/${invocationId}?${searchParams.toString()}`;
  };

  const [_, setSearchParams] = useSearchParams();
  const [selectedInvocations, setSelectedInvocations] = React.useState<
    string[]
  >([]);

  const [isImportStepDialogOpen, setIsImportStepDialogOpen] =
    React.useState(false);

  const clearFilters = () => {
    loadLiveInvocations([], [], undefined, undefined, undefined, []);
    setSearchParams({});
  };

  return (
    <>
      <div className="text-xl font-bold font-mono mb-4">{title}</div>
      <div className="flex flex-row justify-between items-center text-center mb-4">
        <LiveInvocations />
      </div>

      <div className="flex h-4 items-center gap-3">
        <span
          className="text text-xs text-blue-400 font-bold hover:cursor-pointer"
          onClick={clearFilters}
        >
          {"Clear Filters"}
        </span>
        {selectedInvocations.length > 0 && (
          <>
            <ImportToFlowDialog
              setIsImportStepDialogOpen={setIsImportStepDialogOpen}
              isImportStepDialogOpen={isImportStepDialogOpen}
              invocations={invocations.filter((invocation) =>
                selectedInvocations.includes(invocation.id),
              )}
              iconSize={18}
            />
            <span
              onClick={() => setIsImportStepDialogOpen(true)}
              className="text text-xs ml-3 text-blue-400 font-bold hover:cursor-pointer"
            ></span>
          </>
        )}
      </div>

      <div className="flex flex-col w-full overflow-y-auto">
        {loadingInvocations ? (
          <div className="flex h-[25vh] w-full justify-center items-center">
            <LoadingIcon />
          </div>
        ) : (
          invocations.map((invocation, i) => {
            const sniffer = getSnifferById(invocation.snifferId);
            const snifferDomain = sniffer
              ? getSnifferDomain(sniffer.subdomain)
              : "";
            return (
              <Invocation
                invocationId={invocation.id}
                method={invocation.method}
                onClick={() => setActiveInvocation(invocation.id)}
                invocationLink={invocationLink(invocation.id)}
                key={i}
                date={new Date(invocation.createdAt).toLocaleString()}
                status={invocation?.response?.status}
                url={`${snifferDomain}${invocation.url}`}
                setSelectedInvocations={setSelectedInvocations}
              />
            );
          })
        )}
      </div>
    </>
  );
};
