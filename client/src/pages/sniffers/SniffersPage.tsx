import React, { useState } from "react";
import { Requests } from "../requests/requests";
import { SniffersSideBar } from "./SniffersSideBar";
import { Sniffer } from "../../components/page-template/page-template";

const SniffersPage = () => {
  const [activeSniffer, setActiveSniffer] = useState<Sniffer>();
  const [sniffers, setSniffers] = useState<Sniffer[]>([]);

  return (
    <div className="flex flex-row h-full w-full">
      <SniffersSideBar
        activeSniffer={activeSniffer}
        setActiveSniffer={setActiveSniffer}
        sniffers={sniffers}
        setSniffers={setSniffers}
      />
      <div className="flex bg-[#232323] h-full w-full">
        <Requests />
      </div>
    </div>
  );
};

export default SniffersPage;
