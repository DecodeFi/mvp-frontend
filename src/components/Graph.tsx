import React, { useMemo, useCallback } from "react";

import "@xyflow/react/dist/style.css";
import {
  Background,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  NodeProps,
  ReactFlow,
} from "@xyflow/react";

interface NodeData {
  id: string;
  label?: string;
  color?: string;
}

interface EdgeData {
  source: string;
  target: string;
  label?: string;
}

interface Props {
  nodes: NodeData[];
  edges: EdgeData[];
  highlightNodeId?: string;
}

const RoundedNode = ({ data }: NodeProps) => {
  return (
    <div
      style={{
        padding: "6px 12px",
        borderRadius: 8,
        background: "#b91c1c",
        color: "#f3f4f6",
        border: "1px solid #b91c1c",
        fontFamily: "Inter, sans-serif",
        fontSize: 12,
        whiteSpace: "nowrap",
      }}
    >
      {data.label || data.id}
    </div>
  );
};

const nodeTypes = { rounded: RoundedNode };

export function Graph({ nodes, edges, highlightNodeId }: Props) {
  const flowNodes: Node[] = useMemo(
    () =>
      nodes.map((n, index) => ({
        id: n.id,
        type: "rounded",
        data: { label: n.label, id: n.id },
        position: { x: 100, y: 100 + index * 120 },
        style: {
          zIndex: highlightNodeId === n.id ? 10 : 1,
        },
      })),
    [nodes, highlightNodeId],
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      edges.map((e) => ({
        id: `${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: {
          stroke: "rgba(193, 216, 240, 0.6)",
        },
      })),
    [edges],
  );

  return (
    <div style={{ width: "100%", height: 500 }}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}
