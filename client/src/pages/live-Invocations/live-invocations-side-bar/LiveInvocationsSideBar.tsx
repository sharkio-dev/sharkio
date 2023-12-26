import { FormLabel, Button } from "@mui/material";
import { StatusCodeFilter } from "./StatusCodeFilter";
import { useSearchParams } from "react-router-dom";
import { useSniffersStore } from "../../../stores/sniffersStores";
import DateFilter from "./DateFilter";
import dayjs from "dayjs";
import MethodsFilter from "./MethodsFilter";

export enum searchParamFilters {
  fromDate = "FromDateFilter",
  toDate = "ToDateFilter",
  methods = "filteredMethods",
  statusCodes = "statusCodes",
}
const LiveInvocationsSideBar = () => {
  const [searchParams] = useSearchParams();
  const { loadLiveInvocations } = useSniffersStore();

  const handleFilterClick = () => {
    const statusCodes = searchParams.get(searchParamFilters.statusCodes)
      ? searchParams.get(searchParamFilters.statusCodes)!.split(",")
      : [];
    const methods = searchParams.get(searchParamFilters.methods)
      ? searchParams.get(searchParamFilters.methods)!.split(",")
      : [];
    const fromDate = searchParams.get(searchParamFilters.fromDate)
      ? dayjs(searchParams.get(searchParamFilters.fromDate)).toDate()
      : undefined;
    const toDate = searchParams.get(searchParamFilters.toDate)
      ? dayjs(searchParams.get(searchParamFilters.toDate)).toDate()
      : undefined;

    loadLiveInvocations(statusCodes, methods, fromDate, toDate);
  };

  return (
    <div className="flex flex-col px-2 pt-2 space-y-4 h-[calc(vh-96px)] max-h-[calc(vh-96px)] overflow-y-auto">
      <FormLabel className="flex ">Live Invocation Filters</FormLabel>
      <StatusCodeFilter />
      <MethodsFilter />
      <DateFilter />
      <Button variant="outlined" onClick={() => handleFilterClick()}>
        Filter
      </Button>
    </div>
  );
};

export default LiveInvocationsSideBar;

/* <ToggleButtonGroup className="flex flex-col">

        <ToggleButton value={"get"} selected={checkedMethods.GET} onClick={() => handleCheckboxChange("GET")} color="success" size="small" sx={{ color: "success.main" }}>
        Get
        </ToggleButton>
        <ToggleButton value={"post"}>
        Post
        </ToggleButton>
      </ToggleButtonGroup> */
