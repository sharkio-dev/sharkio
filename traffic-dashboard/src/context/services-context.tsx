import { PropsWithChildren, createContext, useState } from "react";
import { getSniffers } from "../api/api";
import { useSnackbar } from "../hooks/useSnackbar";

export type ServicesContextType = {
  loadData?: () => void;
  loading?: boolean;
  data?: any;
};

export const ServicesContext =
  createContext<ServicesContextType>({});

export const RequestMetadataProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [services, setServices] =
    useState<ServicesContextType>({ data: [] });
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = () => {
    if (loading) {
      return;
    }

    setLoading(true);
    getSniffers()
      .then((res) => {
        setServices((prev) => ({ ...prev, data: res.data }));
      })
      .catch(() => {
        setServices((prev) => ({ ...prev, data: [] }));
        show("Failed to fetch requests!", "error");
      })
      .finally(() => setLoading(false));
  };

  const { show, component: snackBar } = useSnackbar();

  return (
    <ServicesContext.Provider
      value={{ data: services.data, loadData, loading }}
    >
      {children}
      {snackBar}
    </ServicesContext.Provider>
  );
};
