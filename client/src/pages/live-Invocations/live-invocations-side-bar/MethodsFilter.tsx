import { MenuItem, Autocomplete, TextField } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { searchParamFilters } from "./LiveInvocationsSideBar";
import CheckIcon from "@mui/icons-material/Check";

enum methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
}
const MethodsFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const handleCheckboxChange = (selectedMethods: string[]) => {
    setSearchParams((prevParams) => {
      const newSearchParams = new URLSearchParams(prevParams);
      newSearchParams.set(
        searchParamFilters.methods,
        selectedMethods.join(","),
      );
      return newSearchParams;
    });
  };

  const selectedMethods: methods[] =
    (searchParams.get(searchParamFilters.methods)?.split(",") as methods[]) ||
    [];

  return (
    <Autocomplete
      multiple
      size="small"
      id="tags-standard"
      sx={{
        width: selectedMethods.length > 3 ? 300 : 200,
        justifyContent: "space-between",
      }}
      onChange={(_, selectedMethods: methods[]) => {
        handleCheckboxChange(selectedMethods);
      }}
      value={selectedMethods}
      options={[
        methods.GET,
        methods.POST,
        methods.PUT,
        methods.DELETE,
        methods.PATCH,
        methods.HEAD,
        methods.OPTIONS,
      ]}
      renderOption={(props, method, { selected }) => (
        <MenuItem key={method} value={method} {...props}>
          {method}
          {selected ? <CheckIcon color="info" /> : null}
        </MenuItem>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Method" variant="outlined" />
      )}
    />
  );
};

export default MethodsFilter;
