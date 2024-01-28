import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

interface TextButtonProps {
  text: string;
  onClick: () => void;
}
export const TextButton: React.FC<TextButtonProps> = ({ text, onClick }) => {
  return (
    <div
      className="flex self-start flex-row items-center space-x-2 px-2 mt-2 w-32 cursor-pointer"
      onClick={onClick}
    >
      <AiOutlinePlus className="flex text-green-400 hover:bg-border-color rounded-md hover:cursor-pointer" />
      <span className="hover:text-green-400">{text}</span>
    </div>
  );
};
