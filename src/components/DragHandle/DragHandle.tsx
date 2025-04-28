import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";

const onConnect = (params) => console.log("handle onConnect", params);

function DragHandleNode() {
  return (
    <>
      <Handle type="target" position={Position.Left} onConnect={onConnect} />
      <div
        className="drag-handle__label"
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        Only draggable here →
        {/* Use the class specified at node.dragHandle here */}
        <span
          className="drag-handle__custom"
          style={{
            display: "inline-block",
            width: "20px",
            height: "20px",
            backgroundColor: "teal",
            marginLeft: "15px",
            borderRadius: "50%",
          }}
        />
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}

export default memo(DragHandleNode);
