import * as React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { TestTree } from "./TestTree";
import { SelectComponent } from "./SelectComponent";

export const TestSuiteSideBar = () => {
  return (
    <>
      <div className="flex flex-row items-center space-x-2 px-2">
        <SelectComponent
          options={[{ value: "1", label: "Test Suite 1" }]}
          title="Test Suite"
        />
        <AiOutlinePlus className="text-[#fff] text-2xl hover:bg-border-color rounded-md hover:cursor-pointer active:scale-110" />
      </div>
      <div className="flex flex-col space-y-2 mt-4">
        <TestTree />
      </div>
    </>
  );
};
