import { useEffect, useState } from "react";
import { MenuItem, Autocomplete, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useSearchParams } from "react-router-dom";
import { searchParamFilters } from "./LiveInvocationsSideBar";
import { useSniffersStore } from "../../../stores/sniffersStores";

const ProxyFilter = () => {
  const [selectedProxies, setSelectedProxies] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const { loadSniffers } = useSniffersStore();
  const [proxies, setProxies] = useState<string[]>([]);

  useEffect(() => {
    const getProxiesNames = async () => {
      const sniffers = await loadSniffers();
      const proxiesNames = sniffers.map((snifferObj) => snifferObj.name);
      setProxies(proxiesNames);
    };

    getProxiesNames();
  }, [loadSniffers]);

  useEffect(() => {
    const proxyParam = searchParams.get(searchParamFilters.proxies);
    if (!proxyParam) return;
    const selectedProxies = proxyParam.split(",");
    setSelectedProxies(selectedProxies);
  }, [searchParams]);

  return (
    <Autocomplete
      multiple
      size="small"
      id="tags-standard"
      options={proxies}
      getOptionLabel={(proxy) => proxy}
      onChange={(_, selectedProxies: string[]) => {
        setSearchParams((prevParams) => {
          const newSearchParams = new URLSearchParams(prevParams);
          newSearchParams.set(
            searchParamFilters.proxies,
            selectedProxies.join(","),
          );
          return newSearchParams;
        });
        setSelectedProxies(selectedProxies);
      }}
      value={selectedProxies}
      renderOption={(props, proxy, { selected }) => (
        <MenuItem
          value={proxy}
          sx={{ justifyContent: "space-between" }}
          {...props}
        >
          {proxy}
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
