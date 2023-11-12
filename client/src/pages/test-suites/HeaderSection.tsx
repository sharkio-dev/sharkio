import * as React from "react";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { SelectComponent } from "./SelectComponent";

export const HeaderSection = ({ headers }) => {
  return (
    <>
      <div className="flex flex-col items-center space-y-2 w-full">
        {headers?.map((header) => (
          <>
            <div className="flex flex-row items-center space-x-2 px-2 w-full">
              <input
                className="border border-border-color rounded-md px-2 py-1 w-full"
                placeholder="Name"
                value={header.name}
              />
              <div className="flex flex-row min-w-[140px]">
                <SelectComponent
                  options={[
                    {
                      value: "equals",
                      label: "Equals",
                    },
                  ]}
                  title="Operator"
                  value={"equals"}
                  setValue={() => {}}
                />
              </div>

              <input
                className="border border-border-color rounded-md px-2 py-1 w-full"
                placeholder="Value"
                value={header.value}
              />
              <div className="flex flex-row min-w-[20px] h-full">
                <AiOutlineDelete className="flex text-[#fff] text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110" />
              </div>
            </div>
          </>
        ))}
      </div>

      <div className="flex flex-row items-center space-x-2 px-2 mt-2 w-32 cursor-pointer">
        <AiOutlinePlus className="flex text-green-400 hover:bg-border-color rounded-md hover:cursor-pointer" />
        <span className="hover:text-green-400">Add Header</span>
      </div>
    </>
  );
};
