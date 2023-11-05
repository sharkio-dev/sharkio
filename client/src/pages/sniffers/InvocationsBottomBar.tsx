import { CgSearch } from "react-icons/cg";
import { InvocationType } from "./types";
import { Invocation } from "./Invocation";

type InvocationsBottomBarProps = {
  invocations?: InvocationType[];
  activeInvocation?: InvocationType;
  setActiveInvocation: (invocationId: InvocationType) => void;
};
export const InvocationsBottomBar = ({
  invocations,
  activeInvocation,
  setActiveInvocation,
}: InvocationsBottomBarProps) => {
  return (
    <>
      <div className="flex flex-row justify-between items-center text-center mb-4">
        <div className="text-xl font-bold font-mono ">Invocations</div>
        <CgSearch className="text-gray-500 text-xl cursor-pointer" />
      </div>

      {invocations &&
        invocations?.map((invocation) => {
          return (
            <Invocation
              isSelected={invocation.id === activeInvocation?.id}
              onClick={() => setActiveInvocation(invocation)}
              key={invocation.id}
              status={invocation.status}
              url={invocation.url}
            />
          );
        })}
    </>
  );
};
