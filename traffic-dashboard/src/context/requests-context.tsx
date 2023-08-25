import React from "react";
import { PropsWithChildren, createContext, useState } from "react";
import { getRequests, getSniffers } from "../api/api";
import { useSnackbar } from "../hooks/useSnackbar";
import { InterceptedRequest, SnifferConfig } from "../types/types";

export type RequestsMetadataContextType = {
  loadData?: () => void;
  loading?: boolean;
  requestsData?: InterceptedRequest[];
  servicesData?: SnifferConfig[];
};

export const RequestsMetadataContext =
  createContext<RequestsMetadataContextType>({});

export const RequestMetadataProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [requestsMetadata, setRequestsMetadata] =
    useState<RequestsMetadataContextType>({ requestsData: [] });

  const [servicesList, setServicesList] = useState<RequestsMetadataContextType>(
    { servicesData: [] },
  );
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    await Promise.all([
      getRequests().then(handleRequests).catch(handleFailureRequests),
      getSniffers().then(handleServices).catch(handleFailureServices),
    ]).finally(() => setLoading(false));
  };

  const handleRequests = (res: any) => {
    setRequestsMetadata((prev) => ({ ...prev, requestsData: res.data }));
  };

  const handleFailureRequests = () => {
    setRequestsMetadata((prev) => ({ ...prev, requestsData: [] }));
    show("Failed to fetch requests!", "error");
  };

  const handleServices = (res: any) => {
    const data = res.data.map((item: { config: { name: any } }) => item.config);
    setServicesList((prev) => ({ ...prev, servicesData: data }));
  };

  const handleFailureServices = () => {
    setRequestsMetadata((prev) => ({ ...prev, servicesData: [] }));
    show("Failed to fetch services!", "error");
  };

  const { show, component: snackBar } = useSnackbar();

  return (
    <RequestsMetadataContext.Provider
      value={{
        requestsData: requestsMetadata.requestsData,
        servicesData: servicesList.servicesData,
        loadData,
        loading,
      }}
    >
      {children}
      {snackBar}
    </RequestsMetadataContext.Provider>
  );
};
