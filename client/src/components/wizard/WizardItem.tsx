import React from "react";
import { MdChevronRight } from "react-icons/md";

interface WizardItemProp {
  title: string;
  onClick?: () => void;
}
export const WizardItem: React.FC<WizardItemProp> = ({ title, onClick }) => {
  return (
    <div
      className="flex flex-row w-full items-center justify-between cursor-pointer hover:text-magic shadow-lg rounded-md border-border-color border p-2 active:bg-border-color"
      onClick={onClick}
    >
      <div className="text-lg ">{title}</div>
      <div className="flex items-center space-x-2">
        <MdChevronRight className="text-xl hover:scale-95 cursor-pointer" />
      </div>
    </div>
  );
};
