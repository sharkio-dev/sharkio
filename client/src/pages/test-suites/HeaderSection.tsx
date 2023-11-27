import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";

type HeaderSectionProps = {
  headers: { name: string; value: any }[];
  setHeaders?: (index: number, value: any, targetPath: string) => void;
  addHeader?: () => void;
  deleteHeader?: (index: number) => void;
};

export const HeaderSection = ({
  headers,
  setHeaders,
  addHeader,
  deleteHeader,
}: HeaderSectionProps) => {
  return (
    <>
      <div className="flex flex-col items-center space-y-2 w-full overflow-y-auto">
        {headers?.map((header, i) => (
          <>
            <div className="flex flex-row items-center space-x-2 w-full">
              <input
                className="border border-border-color rounded-md px-2 py-1 w-full"
                placeholder="Name"
                value={header.name}
                disabled={!setHeaders}
                onChange={(event) => {
                  setHeaders && setHeaders(i, header.value, event.target.value);
                }}
              />
              <div className="flex flex-row">=</div>

              <input
                className="border border-border-color rounded-md px-2 py-1 w-full"
                placeholder="Value"
                value={header.value}
                disabled={!setHeaders}
                onChange={(event) => {
                  setHeaders && setHeaders(i, event.target.value, header.name);
                }}
              />
              {deleteHeader && (
                <div className="flex flex-row min-w-[20px] h-full">
                  <AiOutlineDelete
                    className="flex text-[#fff] text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
                    onClick={() => deleteHeader(i)}
                  />
                </div>
              )}
            </div>
          </>
        ))}
      </div>

      {addHeader && (
        <div
          className="flex flex-row items-center space-x-2 px-2 mt-2 w-32 cursor-pointer"
          onClick={addHeader}
        >
          <AiOutlinePlus className="flex text-green-400 hover:bg-border-color rounded-md hover:cursor-pointer" />
          <span className="hover:text-green-400">Add Header</span>
        </div>
      )}
    </>
  );
};
