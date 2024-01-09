import { useEffect, useState } from "react";
import { MenuItem, Autocomplete, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { allStatusCodes } from "../StatusCodeData";
import { useSearchParams } from "react-router-dom";
import { searchParamFilters } from "./LiveInvocationsSideBar";

type StatusCode = {
  value: string;
  label: string;
};

export const StatusCodeFilter = () => {
  const [selectedStatusCodes, setSelectedStatusCodes] = useState<StatusCode[]>(
    [],
  );
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const savedStatusCodes =
      searchParams.get(searchParamFilters.statusCodes)?.split(",") || [];
    const selectedCodes = allStatusCodes.filter((code) =>
      savedStatusCodes.includes(code.value),
    );
    setSelectedStatusCodes(selectedCodes);
  }, []);

  useEffect(() => {
    const statusCodeValues = selectedStatusCodes.map((code) => code.value);

    setSearchParams((prevParams) => {
      const newSearchParams = new URLSearchParams(prevParams);
      newSearchParams.set(
        searchParamFilters.statusCodes,
        statusCodeValues.join(","),
      );
      return newSearchParams;
    });
  }, [selectedStatusCodes]);

  const handleStatusCodesChange = (selectedOptions: StatusCode[]) => {
    setSelectedStatusCodes(selectedOptions);
  };

  return (
    <Autocomplete
      multiple
      size="small"
      id="tags-standard"
      options={allStatusCodes}
      getOptionLabel={(status) => status.value}
      onChange={(_, selectedCodes: StatusCode[]) =>
        handleStatusCodesChange(selectedCodes)
      }
      value={selectedStatusCodes}
      renderOption={(props, method, { selected }) => (
        <MenuItem
          key={method.value}
          value={method.value}
          sx={{ justifyContent: "space-between" }}
          {...props}
        >
          {method.label}
          {selected ? <CheckIcon color="info" /> : null}
        </MenuItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Filter status codes"
          placeholder="Select status code"
          sx={{ width: 200 }}
        />
      )}
    />
  );
};
