import { StatusCodeFilter } from "./StatusCodeFilter";
import { useSearchParams } from "react-router-dom";
import { useSniffersStore } from "../../../stores/sniffersStores";
import DateFilter from "./DateFilter";
import dayjs from "dayjs";
import MethodsFilter from "./MethodsFilter";
import { useEffect, useRef, useState } from "react";
import UrlFilter from "./UrlFilter";
import ProxyFilter from "./ProxyFilter";

export enum searchParamFilters {
  fromDate = "FromDateFilter",
  toDate = "ToDateFilter",
  toDate2 = "ToDateFilter",
  methods = "filteredMethods",
  statusCodes = "statusCodes",
  url = "filteredUrl",
  proxies = "proxies",
}
const DEBOUNCE_TIME_WAIT: number = 1000;
const LiveInvocations = () => {
  const [searchParams] = useSearchParams();
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
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
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    debounceTimeout.current = setTimeout(() => {
      handleFilterClick();
    }, DEBOUNCE_TIME_WAIT);
  }, [searchParams]);

  return (
    <div className="flex flex-row space-x-4 items-center">
      <UrlFilter />
      <StatusCodeFilter />
      <MethodsFilter />
      <DateFilter />
      <ProxyFilter />
    </div>
  );
};

export default LiveInvocations;
