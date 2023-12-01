import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSniffersStore } from "../../stores/sniffersStores";
import { SideBarItem } from "../sniffers/SniffersSideBar";
import { GiSharkFin } from "react-icons/gi";
import { useMockStore } from "../../stores/mockStore";
import queryString from "query-string";
import { MockList } from "./MockList";

export const MockSideBar = () => {
  const location = useLocation();
  const { snifferId } = queryString.parse(location.search);
  const { sniffers, loadSniffers } = useSniffersStore();
  const { loadMocks, resetMocks } = useMockStore();
  const navigator = useNavigate();

  useEffect(() => {
    loadSniffers(true);
  }, []);

  useEffect(() => {
    if (snifferId) {
      loadMocks(snifferId as string, true);
    } else {
      resetMocks();
    }
  }, [snifferId]);

  return (
    <div className="flex flex-col justify-between items-center px-2 pt-4 space-y-4 h-[calc(vh-96px)] max-h-[calc(vh-96px)] overflow-y-auto">
      <FormControl fullWidth size="small" variant="outlined">
        <InputLabel>Sniffers</InputLabel>
        <Select value={snifferId} label="Sniffers">
          {sniffers.map((sniffer, i) => (
            <MenuItem
              key={i}
              value={sniffer.id}
              onClick={() => {
                let params = new URLSearchParams();
                params.append("snifferId", sniffer.id);
                let queryString = params.toString();
                navigator(`/mocks?${queryString}`);
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
