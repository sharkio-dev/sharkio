import { StatusCodeFilter } from "./StatusCodeFilter";
import { useSearchParams } from "react-router-dom";
import { useSniffersStore } from "../../../stores/sniffersStores";
import DateFilter from "./DateFilter";
import dayjs from "dayjs";
import MethodsFilter from "./MethodsFilter";
import { useEffect, useRef } from "react";
import UrlFilter from "./UrlFilter";

export enum searchParamFilters {
  fromDate = "FromDateFilter",
  toDate = "ToDateFilter",
  methods = "filteredMethods",
  statusCodes = "statusCodes",
  url = "filteredUrl",
}
const DEBOUNCE_TIME_WAIT: number = 1500;
const LiveInvocationsSideBar = () => {
  const [searchParams] = useSearchParams();
  const { loadLiveInvocations } = useSniffersStore();
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
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

    const url = searchParams.get(searchParamFilters.url) || undefined;
    loadLiveInvocations(statusCodes, methods, fromDate, toDate, url);
  };
  useEffect(() => {
    handleFilterClick();
  }, []);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      handleFilterClick();
    }, DEBOUNCE_TIME_WAIT);
  }, [searchParams]);

  return (
    <div className="flex flex-col px-2 pt-3 space-y-4 h-[calc(vh-96px)] max-h-[calc(vh-96px)] ">
      <UrlFilter />

      <div className="border-t border-gray-400 my-4"></div>
      <StatusCodeFilter />
      <div className="border-t border-gray-400 my-4"></div>
      <MethodsFilter />
      <div className="border-t border-gray-400 my-1"></div>
      <DateFilter />
    </div>
  );
};

export default LiveInvocationsSideBar;
