import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { getRequests } from "../api/api";
import { useSnackbar } from "../hooks/useSnackbar";

export type RequestsMetadataContextType = {
  loadData?: () => void;
  loading?: boolean;
  data?: any;
};

export const RequestsMetadataContext =
  createContext<RequestsMetadataContextType>({});

export const RequestMetadataProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [requestsMetadata, setRequestsMetadata] =
    useState<RequestsMetadataContextType>({ data: [] });
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = () => {
    if (loading) {
      return;
    }

    setLoading(true);
    getRequests()
      .then((res) => {
        setRequestsMetadata((prev) => ({ ...prev, data: res.data }));
      })
      .catch(() => {
        setRequestsMetadata((prev) => ({ ...prev, data: [] }));
        show("Failed to fetch requests!", "error");
      })
      .finally(() => setLoading(false));
  };

  const { show, hide, component: snackBar } = useSnackbar();

  return (
    <RequestsMetadataContext.Provider
      value={{ data: requestsMetadata.data, loadData, loading }}
    >
      {children}
      {snackBar}
    </RequestsMetadataContext.Provider>
  );
};
