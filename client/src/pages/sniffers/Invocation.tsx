import React from "react";
import { Tooltip } from "@mui/material";
import { selectIconByMethod } from "./selectIconByMethod";
import { InvocationPreview } from "./InvocationPreview";
import { InvocationType } from "../../pages/sniffers/types";

const dummyResponseData = {
  response: {
    id: "fc6a9e85-1160-4aab-91f8-1765006e369c",
    body: "apple",
    headers: '{connection: "close", content-length: "5", content-…}',
    status: 200,
    createdAt: "2024-02-13T21:14:47.913Z",
    updatedAt: "2024-02-13T21:14:47.913Z",
    requestId: "f0304d66-41b7-420a-a1fe-3f362f4fbebc",
    testExecutionId: null,
    ownerId: "e06b5a5e-d89f-4d30-a7d9-03f91e75b2a8",
    snifferId: "bresponse5d12de2-5819-4dae-8b4e-66695616d64f",
  },
};

export const selectIconByStatus = (status: number) => {
  if (status < 300) {
    return <span className="text-green-500 h-8 w-8 p-1">{status}</span>;
  } else if (status < 400) {
    return <span className="text-yellow-500 h-8 w-8 p-1">{status}</span>;
  }
  return <span className="text-red-500 h-8 w-8 p-1">{status}</span>;
};

type InvocationProps = {
  invocation: InvocationType;
  status: number;
  url: string;
  method: string;
  date?: string;
  isSelected?: boolean;
  onClick?: () => void;
};
export const Invocation = ({
  invocation,
  status,
  url,
  method,
  isSelected,
  onClick,
  date,
}: InvocationProps) => {
  const [openModal, setOpenModal] = React.useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  console.log(JSON.stringify(invocation));

  return (
    <>
      <InvocationPreview
        open={openModal}
        onClose={handleCloseModal}
        response={dummyResponseData.response}
      />

      <Tooltip title={url} placement="top" arrow enterDelay={500}>
        <div
          className={`flex flex-row w-full px-2 hover:bg-secondary cursor-pointer active:bg-primary items-center hover:rounded-md justify-between border-b border-border-color
        ${isSelected ? "bg-primary" : ""}`}
          onClick={onClick}
        >
          <div className="flex flex-row items-center space-x-4">
            {selectIconByMethod(method)}
            <div className="flex text-sm max-w-full overflow-hidden overflow-ellipsis whitespace-nowrap w-[100ch]">
              {url}
            </div>
          </div>

          <div className="flex flex-row items-center space-x-4">
            <span
              className="text text-xs text-blue-400 font-bold hover:cursor-pointer hover:scale-105 active:scale-100"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModal();
              }}
            >
              Preview
            </span>

            {selectIconByStatus(status)}
            <div className="flex text-xs text-gray-500">{date}</div>
          </div>
        </div>
      </Tooltip>
    </>
  );
};
