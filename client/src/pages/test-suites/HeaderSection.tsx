import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import React, { useState } from "react";
import { useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { TextButton } from "../../components/TextButton";
import { Button, TextField } from "@mui/material";

type HeaderSectionProps = {
  headers: { [key: string]: any };
  handleHeadersChange?: (headers: { [key: string]: any }) => void;
};

export const HeaderSection = ({
  headers,
  handleHeadersChange,
}: HeaderSectionProps) => {
  const [newHeaders, setNewHeaders] = React.useState<
    { name: string; value: any }[]
  >([
    {
      name: "",
      value: "",
    },
  ]);

  const [bulkEditMode, setBulkEditMode] = useState(false);

  useEffect(() => {
    if (!headers) return;
    setNewHeaders(
      Object.entries(headers).map(([name, value]) => ({ name, value })),
    );
  }, [headers]);

  const onHeadersChange = (headers: { name: string; value: any }[]) => {
    handleHeadersChange &&
      handleHeadersChange(
        headers.reduce((acc, h) => ({ ...acc, [h.name]: h.value }), {}),
      );
  };

  const addHeader = () => {
    const newh = [
      { name: "header-" + newHeaders.length, value: "" },
      ...newHeaders,
    ];
    onHeadersChange(newh);
  };

  const deleteHeader = (index: number) => {
    const newh = newHeaders.filter((_, i) => i !== index);
    onHeadersChange(newh);
  };

  const setHeaders = (index: number, value: any, key: string) => {
    const newh = newHeaders.map((h, i) => {
      if (i === index) {
        return { name: key, value };
      }
      return h;
    });
    onHeadersChange(newh);
  };

  const handleBulkEditInputChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (e) => {
    setNewHeaders(
      e.target.value.split("\n").map((line) => {
        const [name, value] = line.split("=");
        return { name, value };
      }),
    );
  };
  const handleBulkModeChange = () => {
    setBulkEditMode((prev) => !prev);
  };
  return (
    <div className="flex h-full flex-col items-center space-y-2 w-full overflow-y-auto">
      <div className="flex justify-between w-full">
        {handleHeadersChange && (
          <TextButton text="Add Header" onClick={addHeader} />
        )}
        <Button text="Raw" onClick={handleBulkModeChange}>
          {!bulkEditMode ? (
            <>
              <FormatListBulletedIcon className="mr-2" />
              Bulk edit
            </>
          ) : (
            <>
              <FormatListBulletedIcon className="mr-2" />
              Bulk edit
            </>
          )}
        </Button>
      </div>
      {bulkEditMode ? (
        <>
          <TextField
            className="w-full min-h-fit"
            multiline
            onChange={handleBulkEditInputChange}
            minRows={17}
            disabled={!handleHeadersChange}
            value={newHeaders
              .map(
                (h) =>
                  `${h?.name}${h?.value != null && h?.name != null ? "=" : ""}${
                    h?.value ?? ""
                  }`,
              )
              .join("\n")}
          ></TextField>
        </>
      ) : (
        <>
          {newHeaders?.map((header, i) => (
            <>
              <div className="flex flex-row items-center space-x-2 w-full">
                <TextField
                  className="border border-border-color rounded-md px-2 py-1 w-full"
                  placeholder="Name"
                  value={header.name}
                  disabled={!handleHeadersChange}
                  onChange={(event) => {
                    setHeaders(i, header.value, event.target.value);
                  }}
                  size="small"
                />
                <div className="flex flex-row">=</div>

                <TextField
                  className="border border-border-color rounded-md px-2 py-1 w-full"
                  placeholder="Value"
                  value={header.value}
                  disabled={!handleHeadersChange}
                  onChange={(event) => {
                    setHeaders(i, event.target.value, header.name);
                  }}
                  size="small"
                />
                {handleHeadersChange && (
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
        </>
      )}
    </div>
  );
};
