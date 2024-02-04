import { useEffect, useState } from "react";
import { MenuItem, Autocomplete, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useSearchParams } from "react-router-dom";
import { searchParamFilters } from "./LiveInvocationsSideBar";
import { useSniffersStore } from "../../../stores/sniffersStores";

const ProxyFilter = () => {
  const [selectedProxies, setSelectedProxies] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const { loadSniffers, sniffers } = useSniffersStore();
  const [proxies, setProxies] = useState<string[]>([]);

  useEffect(() => {
    const getProxiesNames = async () => {
      const sniffers = await loadSniffers();
      const proxiesIds = sniffers.map((snifferObj) => snifferObj.id);
      setProxies(proxiesIds);
    };

    getProxiesNames();
  }, [loadSniffers]);

  useEffect(() => {
    const proxyIds = searchParams.get(searchParamFilters.proxies);
    if (!proxyIds) return;
    const selectedProxies = proxyIds.split(",");
    setSelectedProxies(selectedProxies);
  }, [searchParams]);

  const validInitialSelectedProxies = sniffers.filter((proxy) =>
    selectedProxies.includes(proxy.id),
  );

  return (
    <Autocomplete
      multiple
      size="small"
      id="tags-standard"
      options={sniffers}
      getOptionLabel={(proxy) => proxy.name}
      onChange={(_, selectedProxies) => {
        setSearchParams((prevParams) => {
          const newSearchParams = new URLSearchParams(prevParams);
          newSearchParams.set(
            searchParamFilters.proxies,
            selectedProxies.map((proxy) => proxy.id).join(","),
          );
          return newSearchParams;
        });
        setSelectedProxies(selectedProxies.map((proxy) => proxy.id));
      }}
      value={validInitialSelectedProxies}
      renderOption={(props, proxy, { selected }) => (
        <MenuItem
          value={proxy.id}
          sx={{ justifyContent: "space-between" }}
          {...props}
        >
          {proxy.name}
          {selected ? <CheckIcon color="info" /> : null}
        </MenuItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Proxies"
          placeholder="Select a proxy"
          sx={{ width: 200 }}
        />
      )}
    />
  );
};

export default ProxyFilter;
