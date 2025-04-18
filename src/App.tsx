import React, { useMemo, useState } from "react";
import css from "./App.module.css";
import { Header } from "./components/Header";
import { CustomNode } from "./components/CustomNode";
import "@xyflow/react/dist/style.css";
import { ReactFlow } from "@xyflow/react";

function detectSearchType(value) {
  if (!value) return null;
  if (value.startsWith("0x") && value.length === 66) return "tx";
  if (value.startsWith("0x") && value.length === 42) return "address";
  if (/^\d+$/.test(value)) return "block";
  return null;
}

const nodeTypes = {
  custom: CustomNode,
};

function buildGraphFromData(data) {
  if (!data) return { nodes: [], edges: [] };

  const nodesMap = new Map();
  const edges = [];

  for (const tx of data) {
    const { from, to, storage, action, hash } = tx;
    [from, to, storage].forEach((addr) => {
      if (!nodesMap.has(addr))
        nodesMap.set(addr, {
          id: addr,
          type: "custom",
          data: { label: addr },
          dragHandle: ".drag-handle",
          position: { x: Math.random() * 400, y: Math.random() * 400 },
        });
    });

    edges.push({
      id: `${from}-${to}-${hash}`,
      source: from,
      target: to,
      label: `${action} (${hash.slice(0, 8)}…)`,
    });

    if (action === "delegate_call") {
      edges.push({
        id: `${storage}-${to}-${hash}`,
        source: storage,
        target: to,
        label: `delegate_ref (${hash.slice(0, 8)}…)`,
      });
    }
  }

  return {
    nodes: Array.from(nodesMap.values()),
    edges,
  };
}

const sampleData = [
  {
    hash: "0x9bbc6fd8fa80a3dc0bb87ad319f723f8132729bd29d918784f74756deeec9437",
    from: "0x804abde86c3ecc4eb738c452a4cf129e151c3014",
    to: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
    storage: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
    value: "0x3e5500",
    action: "call",
  },
  {
    hash: "0x9bbc6fd8fa80a3dc0bb87ad319f723f8132729bd29d918784f74756deeec9437",
    from: "0x804abde86c3ecc4eb738c452a4cf129e151c3014",
    to: "0x32ec7980b487e4c7142e883fc12aa11905af552f",
    storage: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
    value: "0x3e5500",
    action: "delegate_call",
  },
  {
    hash: "0x9bbc6fd8fa80a3dc0bb87ad319f723f8132729bd29d918784f74756deeec9437",
    from: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
    to: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    storage: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    value: "0x0",
    action: "call",
  },
  {
    hash: "0x9bbc6fd8fa80a3dc0bb87ad319f723f8132729bd29d918784f74756deeec9437",
    from: "0xa69babef1ca67a37ffaf7a485dfff3382056e78c",
    to: "0x43506849d7c04f9138d1a2050bbf3a0c054402dd",
    storage: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    value: "0x0",
    action: "delegate_call",
  },
];

function App() {
  const { nodes, edges } = buildGraphFromData(sampleData);

  return (
    <div className={css.container}>
      <Header />
      <div className={css.graphContainer} style={{ height: 600 }}>
        <style>{`.react-flow__attribution { display: none !important; }`}</style>
        <ReactFlow
          nodesDraggable
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
        />
      </div>
    </div>
  );
}

export default App;
