import React, { useEffect, useState } from "react";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { MultiAutocomplete } from "./MultiSelector";
import { useSearchParams } from "react-router-dom";
type CheckedMethods = {
  get: boolean;
  post: boolean;
  put: boolean;
  delete: boolean;
};
const LiveInvocationsSideBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [checkedMethods, setCheckedMethods] = useState<CheckedMethods>({
    get: false,
    post: false,
    put: false,
    delete: false,
  });

  useEffect(() => {
    const methods = searchParams.get("filteredMethods")
      ? searchParams.get("filteredMethods")!.split(",")
      : [];

    setCheckedMethods((prev) => ({
      ...prev,
      get: methods.includes("get"),
      post: methods.includes("post"),
      put: methods.includes("put"),
      delete: methods.includes("delete"),
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

  return (
    <div className="flex flex-col px-3 pt-3 space-y-4 h-[calc(vh-96px)] max-h-[calc(vh-96px)] overflow-y-auto">
      <MultiAutocomplete />
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedMethods.get}
              onChange={() => handleCheckboxChange("get")}
              color="success"
              size="small"
              sx={{ color: "success.main" }}
            />
          }
          label="Get"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedMethods.post}
              onChange={() => handleCheckboxChange("post")}
              color="primary"
              size="small"
              sx={{ color: "primary.main" }}
            />
          }
          label="Post"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedMethods.put}
              onChange={() => handleCheckboxChange("put")}
              color="warning"
              size="small"
            />
          }
          sx={{ color: "warning.main" }}
          label="Put"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedMethods.delete}
              onChange={() => handleCheckboxChange("delete")}
              color="error"
              size="small"
            />
          }
          sx={{ color: "error.main" }}
          label="Delete"
        />
      </FormGroup>
      {/* <ToggleButtonGroup>
        <ToggleButton value={"get"} selected={checkedItems.get}>
        Get
        </ToggleButton>
        <ToggleButton value={"post"} selected={checkedItems.post}>
        Post
        </ToggleButton>
      </ToggleButtonGroup> */}
    </div>
  );
};

export default LiveInvocationsSideBar;

// className="flex flex-col justify-between items-center px-2 pt-4 space-y-4 h-[calc(vh-96px)] max-h-[calc(vh-96px)] overflow-y-auto"
