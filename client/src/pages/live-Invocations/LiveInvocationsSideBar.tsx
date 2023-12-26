import React, { useEffect, useState } from "react";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { MultiAutocomplete } from "./MultiSelector";
import { useSearchParams } from "react-router-dom";
import { useSniffersStore } from "../../stores/sniffersStores";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";

type CheckedMethods = {
  [key: string]: boolean;
  GET: boolean;
  POST: boolean;
  PUT: boolean;
  DELETE: boolean;
};
const LiveInvocationsSideBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { loadFilteredLiveInvocations } = useSniffersStore();
  const [checkedMethods, setCheckedMethods] = useState<CheckedMethods>({
    GET: false,
    POST: false,
    PUT: false,
    DELETE: false,
  });

  useEffect(() => {
    const methods = searchParams.get("filteredMethods")
      ? searchParams.get("filteredMethods")!.split(",")
      : [];

    setCheckedMethods((prev) => ({
      ...prev,
      GET: methods.includes("GET"),
      POST: methods.includes("POST"),
      PUT: methods.includes("PUT"),
      DELETE: methods.includes("DELETE"),
    }));
  }, []);

  useEffect(() => {
    const selectedMethods = Object.keys(checkedMethods).filter(
      (method) => checkedMethods[method] === true
    );
    setSearchParams((prevSearchParams) => {
      const newSearchParams = new URLSearchParams(prevSearchParams);
      newSearchParams.set("filteredMethods", selectedMethods.join(","));
      return newSearchParams;
    });
  }, [checkedMethods]);

  const handleCheckboxChange = (method: string) => {
    setCheckedMethods((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));
  };
  const handleFilterClick = () => {
    const statusCodes = searchParams.get("statusCodes")
      ? searchParams.get("statusCodes")!.split(",")
      : [];
    const methods = searchParams.get("filteredMethods")
      ? searchParams.get("filteredMethods")!.split(",")
      : [];

    const fromDate = searchParams.get("FromDateFilter");
    const toDate = searchParams.get("ToDateFilter");

    loadFilteredLiveInvocations(
      statusCodes,
      methods,
      fromDate || undefined,
      toDate || undefined
    );
  };

  const handleFromDateChange = (date: Date | null) => {
    console.log(date);
    setSearchParams((prevSearchParams) => {
      const newSearchParams = new URLSearchParams(prevSearchParams);
      newSearchParams.set("FromDateFilter", date?.toString() || "");
      return newSearchParams;
    });
  };
  const handleToDateChange = (date: Date | null) => {
    setSearchParams((prevSearchParams) => {
      const newSearchParams = new URLSearchParams(prevSearchParams);

      // Check if "To" date is after "From" date
      const fromDate = newSearchParams.get("FromDateFilter");
      if (fromDate && date && dayjs(date).isBefore(dayjs(fromDate))) {
        // If "To" date is before "From" date, set "To" date to "From" date
        handleFromDateChange(date);
        newSearchParams.set("ToDateFilter", fromDate);
      } else {
        newSearchParams.set("ToDateFilter", date?.toString() || "");
      }

      return newSearchParams;
    });
  };

  return (
    <div className="flex flex-col px-2 pt-2 space-y-4 h-[calc(vh-96px)] max-h-[calc(vh-96px)] overflow-y-auto">
      <FormLabel className="flex ">Live Invocation Filters</FormLabel>
      <MultiAutocomplete />
      <FormGroup>
        <FormLabel>Methods</FormLabel>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedMethods.GET}
              onChange={() => handleCheckboxChange("GET")}
              color="success"
              size="small"
              sx={{ color: "success.main" }}
            />
          }
          label="GET"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedMethods.POST}
              onChange={() => handleCheckboxChange("POST")}
              color="primary"
              size="small"
              sx={{ color: "primary.main" }}
            />
          }
          label="POST"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedMethods.PUT}
              onChange={() => handleCheckboxChange("PUT")}
              color="warning"
              size="small"
              sx={{ color: "warning.main" }}
            />
          }
          label="PUT"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedMethods.DELETE}
              onChange={() => handleCheckboxChange("DELETE")}
              color="error"
              size="small"
              sx={{ color: "error.main" }}
            />
          }
          label="DELETE"
        />
      </FormGroup>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div>
          <DateTimePicker
            label="From"
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            value={
              dayjs(searchParams.get("FromDateFilter")) || null || undefined
            }
            format="DD/MM/YYYY HH:mm a"
            onChange={(date: Date | null) => handleFromDateChange(date)}
          />
          <Button
            sx={{ height: "23px" }}
            onClick={() => handleFromDateChange(null)}
          >
            Clear
          </Button>
        </div>
        <div>
          <DateTimePicker
            label="To"
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            format="DD/MM/YYYY HH:mm a"
            onChange={(date: Date | null) => handleToDateChange(date)}
            value={dayjs(searchParams.get("ToDateFilter")) || null || undefined}
          />
          <Button
            sx={{ height: "23px" }}
            onClick={() => handleToDateChange(null)}
          >
            Clear
          </Button>
        </div>
      </LocalizationProvider>
      <Button variant="outlined" onClick={() => handleFilterClick()}>
        Filter
      </Button>
      {/* <ToggleButtonGroup className="flex flex-col">

        <ToggleButton value={"get"} selected={checkedMethods.GET} onClick={() => handleCheckboxChange("GET")} color="success" size="small" sx={{ color: "success.main" }}>
        Get
        </ToggleButton>
        <ToggleButton value={"post"}>
        Post
        </ToggleButton>
      </ToggleButtonGroup> */}
    </div>
  );
};

export default LiveInvocationsSideBar;

// className="flex flex-col justify-between items-center px-2 pt-4 space-y-4 h-[calc(vh-96px)] max-h-[calc(vh-96px)] overflow-y-auto"
