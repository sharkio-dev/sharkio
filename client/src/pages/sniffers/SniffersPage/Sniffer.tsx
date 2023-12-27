import React from "react";
import { useSniffersStore } from "../../../stores/sniffersStores";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import ReactFlow, { Handle, NodeProps, Position } from "reactflow";
import { SiAmazonapigateway } from "react-icons/si";
import { MdComputer } from "react-icons/md";

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
    <div className="flex w-[800px] h-full">
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
    <div className="flex flex-col w-full items-center space-y-4 justify-center ">
      <Flow snifferDomain={snifferDomain} targetURL={sniffer.downstreamUrl} />
    </div>
  );
};

export default Sniffer;
