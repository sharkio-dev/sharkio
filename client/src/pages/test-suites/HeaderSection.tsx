import * as React from "react";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { SelectComponent } from "./SelectComponent";

export const HeaderSection = ({ headers, setHeaders }) => {
  const DeleteHeader = (index: number) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
  };

  const AddHeader = () => {
    const newHeaders = [...headers, { name: "", value: "" }];
    setHeaders(newHeaders);
  };

  const handleChange = (index: number, key: string, value: string) => {
    const newHeaders = headers.map((header, i) => {
      if (i === index) {
        return { ...header, [key]: value };
      }
      return header;
    });
    setHeaders(newHeaders);
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-2 w-full">
        {headers?.map((header, i) => (
          <>
            <div className="flex flex-row items-center space-x-2 px-2 w-full">
              <input
                className="border border-border-color rounded-md px-2 py-1 w-full"
                placeholder="Name"
                value={header.name}
                onChange={(event) => {
                  handleChange(i, "name", event.target.value);
                }}
              />
              <div className="flex flex-row">=</div>

              <input
                className="border border-border-color rounded-md px-2 py-1 w-full"
                placeholder="Value"
                value={header.value}
                onChange={(event) => {
                  handleChange(i, "value", event.target.value);
                }}
              />
              <div className="flex flex-row min-w-[20px] h-full">
                <AiOutlineDelete
                  className="flex text-[#fff] text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110"
                  onClick={() => DeleteHeader(i)}
                />
              </div>
            </div>
          </>
        ))}
      </div>

      <div
        className="flex flex-row items-center space-x-2 px-2 mt-2 w-32 cursor-pointer"
        onClick={AddHeader}
      >
        <AiOutlinePlus className="flex text-green-400 hover:bg-border-color rounded-md hover:cursor-pointer" />
        <span className="hover:text-green-400">Add Header</span>
      </div>
    </>
  );
};
