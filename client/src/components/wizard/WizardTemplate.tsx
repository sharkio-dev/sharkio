import React from "react";
import { MdOutlineCancel } from "react-icons/md";
import { RxMagicWand } from "react-icons/rx";
import { FaArrowLeftLong } from "react-icons/fa6";

interface WizardTemplateProps {
  onClose: () => void;
  title: string;
  goBack?: () => void;
  children: React.ReactNode;
}
export const WizardTemplate: React.FC<WizardTemplateProps> = ({
  onClose,
  title,
  goBack,
  children,
}) => {
  return (
    <>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center space-x-2">
          {goBack && (
            <FaArrowLeftLong
              className="text-xl bg-border-color rounded-full p-1 cursor-pointer active:scale-95 transition-all hover:text-magic"
              onClick={goBack}
            />
          )}
          <div className="text-lg">{title}</div>
          <RxMagicWand className="text-xl text-magic" />
        </div>
        <MdOutlineCancel
          className="text-xl cursor-pointer active:scale-95 transition-all hover:text-magic"
          onClick={onClose}
        />
      </div>
      <div className="w-full border-b-[0.05px] my-4" />
      <div className="flex flex-col space-y-2 max-h-[300px] overflow-y-auto">
        {children}
      </div>
    </>
  );
};
