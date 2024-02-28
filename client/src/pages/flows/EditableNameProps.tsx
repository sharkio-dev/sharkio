import { useState } from "react";
import { LoadingIcon } from "../sniffers/LoadingIcon";
import { AiOutlineEdit } from "react-icons/ai";
import { IoSaveOutline } from "react-icons/io5";
import { Input } from "@mui/material";

interface EditableNameProps {
  isLoading: boolean;
  name: string;
  handleSaveClicked: () => void;
  handleNameChange: (namg: string) => void;
}

export const EditableNameField: React.FC<EditableNameProps> = ({
  isLoading = false,
  name,
  handleNameChange,
  handleSaveClicked,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const onSaveClicked = (e: any) => {
    e.stopPropagation();
    handleSaveClicked();
    setIsEditing(false);
  };

  return (
    <div className="flex flex-row items-center space-x-2 h-8">
      {isEditing ? (
        <>
          {isLoading ? (
            <LoadingIcon />
          ) : (
            <IoSaveOutline
              className="text-blue-400 active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md"
              onClick={onSaveClicked}
            />
          )}
          <Input
            className="w-[30ch] border-none focus:ring-0"
            defaultValue={name}
            onChange={(e: any) => {
              e.stopPropagation();
              handleNameChange(e.target.value);
            }}
          />
        </>
      ) : (
        <>
          <AiOutlineEdit
            onClick={(e: any) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className=" text-blue-400 active:scale-110 text-lg cursor-pointer hover:bg-border-color rounded-md"
          />
          <span className="truncate max-w-[50ch]">{name}</span>
        </>
      )}
    </div>
  );
};
