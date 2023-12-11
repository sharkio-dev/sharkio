import ReactFlow, { Background, Handle, NodeProps, Position } from "reactflow";
import { useFlowStore } from "../../stores/testFlowStore";
import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { SideBarItem } from "../sniffers/SniffersSideBar";
import { AiOutlinePlus } from "react-icons/ai";

export const TestFlowPage = () => {
  const { loadFlows, flows } = useFlowStore();
  const { flowId } = useParams();
  const navigator = useNavigate();
  React.useEffect(() => {
    loadFlows().then((flows) => {
      console.log("flows", flows);
      if (!flowId && flows.length > 0) {
        navigator("/flows/" + flows[0].id);
      }
    });
  }, [loadFlows]);

  return (
    <div className={`flex h-full flex-row w-[calc(100vw-56px)]`}>
      <div className="flex flex-col h-full min-w-[240px] w-[240px] border-r border-border-color bg-secondary py-4 space-y-2">
        <div className="flex flex-col items-center space-x-2 px-2">
          <FormControl fullWidth size="small" variant="outlined">
            <InputLabel>Flows</InputLabel>
            <Select value={flowId || ""} label="Flows">
              {flows.map((flow, i) => (
                <MenuItem
                  key={i}
                  onClick={() => {
                    navigator("/flows/" + flow.id);
                  }}
                  value={flow.id}
                >
                  <SideBarItem name={flow.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <NodeList />
      </div>

      <div className="flex flex-col max-h-[calc(100vh-96px)] p-4 w-[calc(100vw-56px-240px)] space-y-4 overflow-y-auto">
        <Flow />
      </div>
    </div>
  );
};

const NodeList = () => {
  const { nodes } = useFlowStore();
  return (
    <div className="flex flex-col w-full">
      <div className="border-b border-border-color pb-2 mb-2">
        <div
          className={`flex flex-row w-full hover:bg-primary  cursor-pointer active:bg-tertiary items-center rounded-md`}
        >
          <div className="flex text-sm overflow-ellipsis whitespace-nowrap items-center p-2 gap-2">
            <AiOutlinePlus className="text-blue-500 text-xl h-[25px] w-[25px]" />
            <div>New</div>
          </div>
        </div>
      </div>
      {nodes.slice(1, nodes.length - 1).map((node, i) => {
        return (
          <div
            className={`flex flex-row w-full hover:bg-border-color cursor-pointer active:bg-tertiary items-center space-x-4 p-1 px-4`}
          >
            <div className="flex text-sm overflow-ellipsis whitespace-nowrap items-center w-full">
              {node.data.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TestNode = (props: NodeProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-32 h-10 bg-border-color border-primary rounded-md">
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
      />
      {props.data?.label}
      <Handle type="source" position={Position.Right} id="a" />
    </div>
  );
};
const StartNode = (_: NodeProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-20 h-10 ">
      <div className="flex flex-col items-center justify-center w-20 h-8 bg-primary rounded-md text-blue-500">
        Start
        <Handle type="source" position={Position.Right} id="a" />
      </div>
    </div>
  );
};
const AddTestNode = (_: NodeProps) => {
  const { appendNode } = useFlowStore();
  return (
    <div
      className="flex flex-col items-center justify-center w-32 h-10 bg-primary rounded-md hover:text-blue-500 hover:scale-105 active:scale-100"
      onClick={appendNode}
    >
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log("handle onConnect", params)}
      />
      <p className="text-sm">+ Add Test</p>
    </div>
  );
};
const nodeTypes = {
  test: TestNode,
  start: StartNode,
  add: AddTestNode,
};
const Flow = () => {
  const { nodes, edges } = useFlowStore();

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView nodeTypes={nodeTypes}>
        <Background />
      </ReactFlow>
    </div>
  );
};
