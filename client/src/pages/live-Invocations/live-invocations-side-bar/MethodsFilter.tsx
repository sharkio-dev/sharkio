import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { searchParamFilters } from "./LiveInvocationsSideBar";
enum methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}
const MethodsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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
    <FormGroup>
      <FormLabel>Methods</FormLabel>
      <FormControlLabel
        control={
          <Checkbox
            checked={searchParams
              .get(searchParamFilters.methods)
              ?.includes(methods.GET)}
            onChange={() => handleCheckboxChange(methods.GET)}
            color="success"
            size="small"
            sx={{ color: "success.main" }}
          />
        }
        label={methods.GET}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={searchParams
              .get(searchParamFilters.methods)
              ?.includes(methods.POST)}
            onChange={() => handleCheckboxChange(methods.POST)}
            color="primary"
            size="small"
            sx={{ color: "primary.main" }}
          />
        }
        label={methods.POST}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={searchParams
              .get(searchParamFilters.methods)
              ?.includes(methods.PUT)}
            onChange={() => handleCheckboxChange(methods.PUT)}
            color="warning"
            size="small"
            sx={{ color: "warning.main" }}
          />
        }
        label={methods.PUT}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={searchParams
              .get(searchParamFilters.methods)
              ?.includes(methods.DELETE)}
            onChange={() => handleCheckboxChange(methods.DELETE)}
            color="error"
            size="small"
            sx={{ color: "error.main" }}
          />
        }
        label={methods.DELETE}
      />
    </FormGroup>
  );
};

export default MethodsFilter;
