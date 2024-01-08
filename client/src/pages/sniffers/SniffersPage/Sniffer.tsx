import queryString from "query-string";
import React from "react";
import { MdComputer } from "react-icons/md";
import { SiAmazonapigateway } from "react-icons/si";
import { useLocation } from "react-router-dom";
import { useSniffersStore } from "../../../stores/sniffersStores";
import styles from "./sniffer.module.scss";

import { VscTypeHierarchy } from "react-icons/vsc";
import "reactflow/dist/style.css";

const Sniffer: React.FC = () => {
  const location = useLocation();
  const { snifferId } = queryString.parse(location.search);
  const sniffer = useSniffersStore((s) =>
    s.sniffers.find((s) => s.id === snifferId),
  );
  const { loadingSniffers } = useSniffersStore();

  if (!sniffer)
    return (
      <div className="flex flex-1 items-center justify-center flex-col">
        {!loadingSniffers && (
          <>
            <div className="text-2xl font-bold">Create a Sniffer</div>
            <div className="text-lg font-medium ">
              Create a new sniffer to start recording requests
            </div>
          </>
        )}
      </div>
    );

  const snifferDomain = `https://${sniffer.subdomain}.${
    import.meta.env.VITE_PROXY_DOMAIN
  }`;

  return (
    <div className="relative flex w-full h-full  overflow-auto">
      <div className="relative w-fit flex m-auto">
        {/* <!-- Service/App Block --> */}
        <div className={`flex flex-col items-center w-[300px]`}>
          <div className="p-4 bg-gray-700 rounded-lg hover:border hover:border-blue-500 hover:border-width-2">
            <i className="fa fa-laptop" aria-hidden="true"></i>
            {/* <!-- Placeholder for actual icon --> */}
            <MdComputer className="text-2xl" />
          </div>
          <p className="text-xs mt-2">Service / App</p>
          <p className="text-xs mt-2">Should request the sniffer's domain</p>
        </div>
        <div className={`absolute h-[2px] w-[240px] left-[180px] top-[20px]`}>
          <div className={`${styles.wrapper}`}></div>
        </div>
        <div className={`absolute h-[1px] w-[240px] left-[180px] top-[35px]`}>
          <div className={`${styles.wrapperInverted}`}></div>
        </div>

        <div>
          {/* <!-- Sniffer Block --> */}
          <div className="flex flex-col items-center w-[300px] ">
            <div className="p-4 bg-gray-700 rounded-lg hover:border hover:border-blue-500 hover:border-width-2">
              <i className="fa fa-network-wired" aria-hidden="true"></i>
              {/* <!-- Placeholder for actual icon --> */}
              <VscTypeHierarchy className="text-2xl" />
            </div>
            <p className="text-xs mt-2">Sniffer</p>
            <p className="text-xs mt-2">{snifferDomain}</p>
          </div>

          <div className="absolute h-[3px] w-[240px] left-[480px] top-[20px] ">
            <div className={`${styles.wrapper}`}></div>
          </div>
          <div className="absolute h-[3px] w-[240px] left-[480px] top-[35px] ">
            <div className={`${styles.wrapperInverted}`}></div>
          </div>
        </div>
        {/* <!-- API Block --> */}
        <div className="flex flex-col items-center w-[300px]">
          <div className="p-4 bg-gray-700 rounded-lg hover:border hover:border-blue-500 hover:border-width-2">
            <i className="fa fa-code" aria-hidden="true"></i>
            {/* <!-- Placeholder for actual icon --> */}
            <SiAmazonapigateway className="text-2xl" />
          </div>
          <p className="text-xs mt-2">API</p>
          <p className="text-xs mt-2">https://localhost:5012</p>
        </div>
      </div>
    </div>
  );
};

export default Sniffer;
