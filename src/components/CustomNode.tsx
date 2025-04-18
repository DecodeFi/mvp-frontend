import { Handle, Position } from "@xyflow/react";

export function CustomNode({ data, dragHandle }) {
  return (
    <div
      style={{
        padding: 10,
        border: "2px solid #222",
        borderRadius: 6,
        background: "black",
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div className={dragHandle?.slice(1)}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
