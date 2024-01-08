import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSniffersStore } from "../../stores/sniffersStores";
import { SideBarItem } from "../sniffers/SniffersSideBar";
import { GiSharkFin } from "react-icons/gi";
import { useMockStore } from "../../stores/mockStore";
import queryString from "query-string";
import { MockList } from "./MockList";
import { useSnackbar } from "../../hooks/useSnackbar";

export const MockSideBar: React.FC = () => {
  const location = useLocation();
  const { snifferId } = queryString.parse(location.search);
  const { sniffers, loadSniffers } = useSniffersStore();
  const { loadMocks, resetMocks } = useMockStore();
  const { show: showSnackbar, component: snackBar } = useSnackbar();

  const navigator = useNavigate();

  useEffect(() => {
    loadSniffers(true);
  }, []);

  useEffect(() => {
    if (snifferId) {
      loadMocks(snifferId as string).catch(() => {
        showSnackbar("Error loading mocks", "error");
      });
    } else {
      resetMocks();
    }
  }, [snifferId]);

  useEffect(() => {
    if (!snifferId && sniffers.length > 0) {
      navigator(`/mocks?snifferId=${sniffers[0].id}`);
      return;
    }
  }, [sniffers]);

  return (
    <div className="flex flex-col justify-between items-center px-2 pt-4 space-y-4 h-[calc(vh-96px)] max-h-[calc(vh-96px)] overflow-y-auto">
      {snackBar}
      <FormControl fullWidth size="small" variant="outlined">
        <InputLabel>Sniffers</InputLabel>
        <Select value={snifferId || ""} label="Sniffers">
          {sniffers.map((sniffer, i) => (
            <MenuItem
              key={i}
              value={sniffer.id}
              onClick={() => {
                navigator(`/mocks?snifferId=${sniffer.id}`);
              }}
            >
              <SideBarItem
                LeftIcon={GiSharkFin}
                isSelected={snifferId === sniffer.id}
                name={sniffer.name}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {snifferId && <MockList />}
    </div>
  );
};
