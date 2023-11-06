import { CgSearch } from "react-icons/cg";
import { InvocationType } from "./types";
import { Invocation } from "./Invocation";
import { useState } from "react";
import { TextField } from "@mui/material";

type InvocationsBottomBarProps = {
  invocations?: InvocationType[];
  activeInvocation?: InvocationType;
  setActiveInvocation: (invocationId: InvocationType) => void;
  title: string;
};
export const InvocationsBottomBar = ({
  invocations,
  activeInvocation,
  setActiveInvocation,
  title,
}: InvocationsBottomBarProps) => {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filteredInvocations =
    invocations?.filter((invocation) => {
      if (!search) return true;
      const filterByMethod = invocation?.status
        .toString()
        .includes(search.toLowerCase());
      const filterByUrl = invocation?.url
        .toLowerCase()
        .includes(search.toLowerCase());

      return filterByMethod || filterByUrl;
    }) || [];

  return (
    <>
      <div className="flex flex-row justify-between items-center text-center mb-4">
        <div className="text-xl font-bold font-mono ">{title}</div>
        {!showSearch ? (
          <CgSearch
            className="text-gray-500 text-xl cursor-pointer"
            onClick={() => setShowSearch(true)}
          />
        ) : (
          <TextField
            label="Search Invocations"
            variant="outlined"
            size="small"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            className="w-1/2"
          />
        )}
      </div>

      {invocations &&
        filteredInvocations.map((invocation, i) => {
          return (
            <Invocation
              isSelected={invocation.id === activeInvocation?.id}
              onClick={() => setActiveInvocation(invocation)}
              key={i}
              status={invocation.status}
              url={invocation.url}
            />
          );
        })}
    </>
  );
};
