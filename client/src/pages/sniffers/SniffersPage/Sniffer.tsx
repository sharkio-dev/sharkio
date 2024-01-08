import React from "react";
import { useSniffersStore } from "../../../stores/sniffersStores";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import ReactFlow, { Handle, NodeProps, Position } from "reactflow";
import { SiAmazonapigateway } from "react-icons/si";
import { MdComputer } from "react-icons/md";
import styles from "./sniffer.module.scss";

import "reactflow/dist/style.css";
import { VscTypeHierarchy } from "react-icons/vsc";

const SnifferNode = (props: NodeProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-[6px]">{props.data.label}</div>
      <div className="flex flex-row items-center gap-2 w-24 bg-primary p-2 rounded-lg shadow-md justify-center">
        <VscTypeHierarchy className="text-2xl" />
      </div>
      <div className="text-[6px] max-w-[105px] truncate">
        {props.data.address}
      </div>
      <Handle type="source" position={Position.Right} id="a" />
      <Handle type="target" position={Position.Left} id="b" />
    </div>
  );
};

const APINode = (props: NodeProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-[6px]">{props.data.label}</div>
      <div className="flex flex-row items-center gap-2 w-24 bg-primary p-2 rounded-lg shadow-md justify-center">
        <SiAmazonapigateway className="text-2xl" />
      </div>
      <div className="text-[6px]">{props.data.address}</div>
      <Handle type="target" position={Position.Left} id="d" />
    </div>
  );
};

const ServiceNode = (props: NodeProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-[6px]">{props.data.label}</div>
      <div className="flex flex-row items-center gap-2 w-24 bg-primary p-2 rounded-lg shadow-md justify-center">
        <MdComputer className="text-2xl" />
      </div>
      <div className="text-[6px]">{props.data.address}</div>
      <Handle type="source" position={Position.Right} id="c" />
    </div>
  );
};

const nodeTypes = {
  sniffer: SnifferNode,
  api: APINode,
  consumer: ServiceNode,
};

const Flow = ({
  snifferDomain,
  targetURL,
}: {
  snifferDomain: string;
  targetURL: string;
}) => {
  const nodes = [
    {
      id: "1",
      position: { x: 0, y: 0 },
      data: {
        label: "Service / App",
        address: "Should request the sniffer's domain",
      },
      type: "consumer",
    },
    {
      id: "2",
      position: { x: 200, y: 0 },
      data: {
        label: "Sniffer",
        address: snifferDomain,
      },
      type: "sniffer",
    },
    {
      id: "3",
      position: { x: 400, y: 0 },
      data: { label: "API", address: targetURL },
      type: "api",
    },
  ];

  const edges = [
    { id: "e1-2", source: "1", target: "2", animated: true },
    { id: "e1-3", source: "2", target: "3", animated: true },
  ];

  return (
    <div className="flex w-[90%] h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        edgesFocusable={false}
        fitView={true}
      ></ReactFlow>
    </div>
  );
};

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
