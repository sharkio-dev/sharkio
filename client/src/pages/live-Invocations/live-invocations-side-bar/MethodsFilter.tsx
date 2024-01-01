import {
  FormGroup,
  ToggleButton,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { searchParamFilters } from "./LiveInvocationsSideBar";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

enum methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}
const MethodsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [methodFilters, setMethodFilters] = useState<Boolean>(false);
  const handleCheckboxChange = (method: string) => {
    setSearchParams((prevSearchParams) => {
      const newSearchParams = new URLSearchParams(prevSearchParams);
      const filteredMethods =
        newSearchParams.get(searchParamFilters.methods) || "";
      const methodIncluded = filteredMethods.includes(method);

      if (methodIncluded) {
        const updatedMethods = filteredMethods.replace("," + method, "");
        newSearchParams.set(searchParamFilters.methods, updatedMethods);
      } else {
        const updatedMethods = filteredMethods + "," + method;
        newSearchParams.set(searchParamFilters.methods, updatedMethods);
      }

      return newSearchParams;
    });
  };

  return (
    <div className="flex flex-col ">
      <ToggleButton
        onClick={() => setMethodFilters(!methodFilters)}
        selected={methodFilters === true}
        size="small"
        value={methodFilters}
      >
        <div className="flex items-center gap-1 ">
          Filter Methods
          <AiOutlineSearch />
        </div>
      </ToggleButton>
      {methodFilters && (
        <FormGroup className="ml-1 ">
          <div className="flex flex-row mt-2 space-x-3">
            <ToggleButton
              selected={searchParams
                .get(searchParamFilters.methods)
                ?.includes(methods.GET)}
              value={methods.GET}
              color="success"
              size="small"
              sx={{ color: "success.main", flex: "1" }}
              onChange={() => handleCheckboxChange(methods.GET)}
            >
              GET
            </ToggleButton>
            <ToggleButton
              value={methods.POST}
              color="primary"
              size="small"
              sx={{ color: "primary.main", flex: "1" }}
              onChange={() => handleCheckboxChange(methods.POST)}
              selected={searchParams
                .get(searchParamFilters.methods)
                ?.includes(methods.POST)}
            >
              {methods.POST}
            </ToggleButton>
          </div>
          <div className="flex flex-row mt-2  space-x-2">
            <ToggleButton
              value={methods.PUT}
              color="warning"
              size="small"
              sx={{ color: 'warning.main', flex: "1" }}
              onChange={() => handleCheckboxChange(methods.PUT)}
              selected={searchParams
                .get(searchParamFilters.methods)
                ?.includes(methods.PUT)}
            >
              {methods.PUT}
            </ToggleButton>
            <ToggleButton
              value={methods.DELETE}
              color="error"
              size="small"
              selected={searchParams
                .get(searchParamFilters.methods)
                ?.includes(methods.DELETE)}
              sx={{ color: "error.main", flex: "1" }}
              onChange={() => handleCheckboxChange(methods.DELETE)}
            >
              {methods.DELETE}
            </ToggleButton>
            <ToggleButton
              value={methods.PATCH}
              color="secondary"
              size="small"
              sx={{ color: "secondary.main", flex: "1" }}
              onChange={() => handleCheckboxChange(methods.PATCH)}
              selected={searchParams
                .get(searchParamFilters.methods)
                ?.includes(methods.PATCH)}
            >
              {methods.PATCH}
            </ToggleButton>
          </div>
        </FormGroup>
      )}
    </div>
  );
};

export default MethodsFilter;
