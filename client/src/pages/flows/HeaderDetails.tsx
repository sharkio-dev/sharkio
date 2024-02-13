type HeaderDetailsProps = {
  status?: "success" | "failure";
  expectedHeaderName: string;
  expectedHeaderValue: string;
  actualHeaderName: string;
  actualHeaderValue: string;
};
export const HeaderDetails = ({
  status = "success",
  expectedHeaderName,
  expectedHeaderValue,
  actualHeaderName,
  actualHeaderValue,
}: HeaderDetailsProps) => {
  return (
    <div className="flex flex-row items-center w-full py rounded-lg pb-4 space-x-4 px-4">
      <div className="flex flex-row items-center w-1/2 h-full border-r-secondary border-r bg-secondary rounded-lg p-4">
        <div className="flex flex-col">
          <span className="text text-xs">
            Expected Header - {expectedHeaderName}
          </span>
          <span className="text text-xs">
            Expected Value - {expectedHeaderValue}
          </span>
        </div>
      </div>
      <div className="flex flex-row items-center w-1/2 h-full border-r-secondary border-r bg-secondary rounded-lg p-4">
        {status === "success" ? (
          <span className="text-green-400 mr-2">✓</span>
        ) : (
          <span className="text-red-400 mr-2">✗</span>
        )}
        <div className="flex flex-col">
          <span className="text text-xs">
            Actual Header - {actualHeaderName}
          </span>
          <span className="text text-xs">
            Actual Value - {actualHeaderValue}
          </span>
        </div>
      </div>
    </div>
  );
};
