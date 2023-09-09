import { Autocomplete, TextField } from "@mui/material";
import { SnifferConfig } from "../../types/types";
import { useContext, useEffect } from "react";
import { RequestsMetadataContext } from "../../context/requests-context";

interface ISnifferSelector {
  onChange: (value: string) => void;
  selectedSnifferPort: string;
}

export const SnifferSelector: React.FC<ISnifferSelector> = ({
  onChange,
  selectedSnifferPort,
}) => {
  const { servicesData: services, loadData } = useContext(
    RequestsMetadataContext,
  );
  const selectedSnifferName = services?.find(
    (service) => service.port === +selectedSnifferPort,
  );

  useEffect(() => {
    loadData?.();
  }, []);

  return (
    <Autocomplete
      freeSolo
      disablePortal
      value={selectedSnifferName}
      getOptionLabel={(option: SnifferConfig | string) => {
        return typeof option === "object" ? option.name : option;
      }}
      options={services ?? []}
      renderInput={(params) => <TextField {...params} label="Service" />}
      onChange={(_, value: string | SnifferConfig | null) => {
        const newValue = typeof value === "object" ? value && value.id : value;
        newValue && onChange(newValue);
      }}
    />
  );
};
